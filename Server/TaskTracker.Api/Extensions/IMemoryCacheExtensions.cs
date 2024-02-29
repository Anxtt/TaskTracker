using Microsoft.Extensions.Caching.Memory;

using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Models.Identity;
using TaskTracker.Core.Services.Contracts;

namespace TaskTracker.Api.Extensions
{
    public static class IMemoryCacheExtensions
    {
        // User
        public static async Task<IdentityResponseModel> ShortCacheAuth(
            this IMemoryCache cache,
            string key,
            string userId,
            string token,
            IIdentityService identityService)
                => await cache.GetOrCreateAsync(key, async x =>
                {
                    x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(10);
                    x.SlidingExpiration = TimeSpan.FromSeconds(30);

                    string userName = await identityService.GetUserNameById(userId);

                    return new IdentityResponseModel()
                    {
                        UserName = userName,
                        Token = token
                    };
                });

        public static async Task<bool> ShortCacheEmail(
            this IMemoryCache cache,
            string key,
            string email,
            IIdentityService identityService)
                => await cache.GetOrCreateAsync(key, async x =>
                {
                    x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1);
                    x.SlidingExpiration = TimeSpan.FromSeconds(30);

                    return await identityService.DoesExistByEmail(email);
                });

        public static async Task<bool> ShortCacheUserName(
            this IMemoryCache cache,
            string key,
            string username,
            IIdentityService identityService)
                => await cache.GetOrCreateAsync(key, async x =>
                {
                    x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1);
                    x.SlidingExpiration = TimeSpan.FromSeconds(30);

                    return await identityService.DoesExistByUserName(username);
                });

        // Tasks
        public static async Task<bool> ShortCacheTaskName(
            this IMemoryCache cache,
            string key,
            string taskName,
            string userId,
            IChoreService choreService)
                => await cache.GetOrCreateAsync(key, async x =>
                {
                    x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1);
                    x.SlidingExpiration = TimeSpan.FromSeconds(30);

                    return await choreService.DoesExist(taskName, userId);
                });


        public static async Task<bool> ShortCacheTaskName(
            this IMemoryCache cache,
            string key,
            int taskId,
            string userId,
            IChoreService choreService)
                => await cache.GetOrCreateAsync(key, async x =>
                {
                    x.AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1);
                    x.SlidingExpiration = TimeSpan.FromSeconds(30);

                    return await choreService.DoesExist(taskId, userId);
                });
    }
}
