using Microsoft.Extensions.Caching.Memory;

using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Models.Chore;
using TaskTracker.Core.Models.Identity;
using TaskTracker.Core.Services.Contracts;

using static TaskTracker.Core.Constants.Web.Identity;
using static TaskTracker.Core.Constants.Web.Task;

namespace TaskTracker.Api.Extensions
{
    public static class IMemoryCacheExtensions
    {
        // User
        public static async Task<IdentityResponseModel> ShortCacheAuth(
            this IMemoryCache cache,
            string userId,
            string token,
            string refresh,
            IIdentityService identityService)
                => await cache.GetOrCreateAsync(
                    string.Format(AUTH_CACHE_KEY, userId),
                    async x =>
                    {
                        x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(5);

                        string userName = await identityService.GetUserNameById(userId);

                        return new IdentityResponseModel()
                        {
                            UserName = userName,
                            AccessToken = token,
                            RefreshToken = refresh
                        };
                    });

        public static async Task<bool> ShortCacheEmail(
            this IMemoryCache cache,
            string email,
            IIdentityService identityService)
                => await cache.GetOrCreateAsync(
                    string.Format(EMAIL_CACHE_KEY, email),
                    async x =>
                    {
                        x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1);
                        x.SlidingExpiration = TimeSpan.FromSeconds(30);

                        return await identityService.DoesExistByEmail(email);
                    });

        public static async Task<bool> ShortCacheUserName(
            this IMemoryCache cache,
            string username,
            IIdentityService identityService)
                => await cache.GetOrCreateAsync(
                    string.Format(USERNAME_CACHE_KEY, username),
                    async x =>
                    {
                        x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1);
                        x.SlidingExpiration = TimeSpan.FromSeconds(30);

                        return await identityService.DoesExistByUserName(username);
                    });

        // Tasks
        public static async Task<bool> ShortCacheTaskNameByName(
            this IMemoryCache cache,
            string taskName,
            string userId,
            IChoreService choreService)
                => await cache.GetOrCreateAsync(
                    string.Format(TASK_NAME_CACHE_KEY, userId, taskName),
                    async x =>
                    {
                        x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1);
                        x.SlidingExpiration = TimeSpan.FromSeconds(30);

                        return await choreService.DoesExist(taskName, userId);
                    });


        public static async Task<bool> ShortCacheTaskNameById(
            this IMemoryCache cache,
            int taskId,
            string userId,
            IChoreService choreService)
                => await cache.GetOrCreateAsync(
                    string.Format(TASK_NAME_CACHE_KEY, userId, taskId),
                    async x =>
                    {
                        x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1);
                        x.SlidingExpiration = TimeSpan.FromSeconds(30);

                        return await choreService.DoesExist(taskId, userId);
                    });

        public static async Task<IEnumerable<ChoreResponseModel>> ShortCacheTasksByUserId(
            this IMemoryCache cache,
            string userId,
            string username,
            IChoreService choreService)
                => await cache.GetOrCreateAsync(
                    string.Format(USER_TASKS_CACHE_KEY, userId, username),
                    async x =>
                    {
                        x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(3);
                        x.SlidingExpiration = TimeSpan.FromSeconds(30);

                        return await choreService.All(userId);
                    });
    }
}
