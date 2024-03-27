using Microsoft.Extensions.Caching.Memory;

using System.Collections.Concurrent;
using System.Text;

using TaskTracker.Api.Extensions;
using TaskTracker.Core.Services.Contracts;

namespace TaskTracker.Api.Middleware
{
    public class DebouncingMiddleware : IMiddleware
    {
        private static readonly ConcurrentDictionary<string, Task<bool>> callsByPath = new ConcurrentDictionary<string, Task<bool>>();

        private const string TASK_NAME_CACHE_KEY = $"DoesExistByName-{{0}}-{{1}}";

        private readonly IMemoryCache cache;

        private readonly IChoreService choreService;

        public DebouncingMiddleware(IChoreService choreService, IMemoryCache cache)
        {
            this.choreService = choreService;
            this.cache = cache;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            if (context.User == null)
            {
                await next(context);
            }

            string path = context.Request.Path.Value!;
            string name = path.Split('/').Last();
            bool doesMatch = path.Contains("DoesExist");
            string userId = context.User!.GetId();

            if (doesMatch == true)
            {
                CancellationTokenSource tokenSource = null;

                if (callsByPath.ContainsKey(path) == false)
                {
                    tokenSource?.Cancel();

                    tokenSource = new CancellationTokenSource();
                    CancellationToken token = tokenSource.Token;

                    await Task
                         .Delay(2000, token)
                         .ContinueWith(async _ =>
                         {
                             if (_.IsCompletedSuccessfully)
                             {
                                 await callsByPath.AddOrUpdate(
                                 path,
                                 this.cache
                                    .ShortCacheTaskNameByName(name, userId, this.choreService),
                                 (x, y) => y);
                             }

                         }, TaskScheduler.Default);
                }

                context.Response.Clear();
                context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
                context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000");
                context.Response.ContentType = "application/json, charset=utf-8";

                string result = callsByPath[path].Result.ToString();

                if (result == "True")
                {
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    await context.Response.Body.WriteAsync(Encoding.ASCII.GetBytes("true"), 0, 4);
                }
                else
                {
                    context.Response.StatusCode = StatusCodes.Status200OK;
                    await context.Response.Body.WriteAsync(Encoding.ASCII.GetBytes("false"), 0, 5);
                }

                return;
            }

            await next(context);
        }
    }
}
