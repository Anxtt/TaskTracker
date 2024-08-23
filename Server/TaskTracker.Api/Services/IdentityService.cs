using Microsoft.EntityFrameworkCore;

using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Models;
using TaskTracker.Core.Models.Identity;

using TaskTracker.Data;
using TaskTracker.Data.Models;

namespace TaskTracker.Api.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly TaskTrackerDbContext db;
        private readonly IJwtService jwtService;

        public IdentityService(TaskTrackerDbContext db, IJwtService jwt)
            => (this.db, this.jwtService) = (db, jwt);

        /// <summary>
        /// Creates a JWT and a Refresh Token for the given <see cref="ApplicationUser"/> <paramref name="user"/>.
        /// </summary>
        /// <param name="user"></param>
        /// <returns>
        /// <see cref="IdentityResponseModel"/>
        /// </returns>
        public async Task<IdentityResponseModel> Authenticate(ApplicationUser user)
        {
            string accessToken = this.jwtService.GenerateToken(user);
            RefreshTokenModel refreshToken = this.jwtService.GenerateRefreshToken();

            user.RefreshToken = refreshToken.Token;
            user.Created = DateTime.Now;
            user.Expires = user.Created.AddMinutes(60);

            await this.db.SaveChangesAsync();

            IdentityResponseModel authenticated = new IdentityResponseModel()
            {
                UserName = user.UserName,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token
            };

            return authenticated;
        }

        /// <summary>
        /// Checks if an <see cref="ApplicationUser"/> with the given <paramref name="email"/> exists.
        /// </summary>
        /// <param name="email"></param>
        /// <returns>
        /// A <see cref="bool"/> value on the executed query with a parameter <paramref name="email"/>.
        /// </returns>
        public async Task<bool> DoesExistByEmail(string email)
            => await this.db
            .Users
            .AnyAsync(x => x.Email == email);

        /// <summary>
        /// Checks if an <see cref="ApplicationUser"/> with the given <paramref name="id"/> exists.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>
        /// A <see cref="bool"/> value on the executed query with a parameter <paramref name="id"/>.
        /// </returns>
        public async Task<bool> DoesExistById(string id)
            => await this.db
            .Users
            .AnyAsync(x => x.Id == id);

        /// <summary>
        /// Checks if an <see cref="ApplicationUser"/> with the given <paramref name="username"/> exists.
        /// </summary>
        /// <param name="username"></param>
        /// <returns>
        /// A <see cref="bool"/> value on the executed query with a parameter <paramref name="username"/>.
        /// </returns>
        public async Task<bool> DoesExistByUserName(string username)
            => await this.db
            .Users
            .AnyAsync(x => x.UserName == username);

        /// <summary>
        /// Queries the first <see cref="ApplicationUser"/> with the given <paramref name="id"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>
        /// <see cref="ApplicationUser"/>
        /// </returns>
        public async Task<ApplicationUser> GetById(string id)
                => await this.db
                .Users
                .FirstOrDefaultAsync(x => x.Id == id);

        /// <summary>
        /// Queries the first <see cref="ApplicationUser"/> with the given <paramref name="id"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>
        /// The Username of an <see cref="ApplicationUser"/>.
        /// </returns>
        public async Task<string> GetUserNameById(string id)
            => await GetQueryableUser(id)
            .Select(x => x.UserName)
            .FirstAsync();

        public async Task<ApplicationUser> GetUserByRefreshToken(string refreshToken, string accessToken)
            => await this.db
            .Users
            .Where(x => x.RefreshToken == refreshToken)
            .FirstOrDefaultAsync();

        public async Task<IdentityResponseModel> RefreshToken(string refreshToken, string accessToken)
        {
            ApplicationUser user = await this.GetUserByRefreshToken(refreshToken, accessToken);

            if (user is null || user.IsExpired is true || user.RefreshToken != refreshToken)
            {
                return default;
            }

            return await this.Authenticate(user);
        }

        private IQueryable<ApplicationUser> GetQueryableUser(string id)
            => this.db
            .Users
            .Where(x => x.Id == id);
    }
}
