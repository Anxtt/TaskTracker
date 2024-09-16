using Microsoft.EntityFrameworkCore;

using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Models;
using TaskTracker.Core.Models.Chore;
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
            user.Created = refreshToken.Created;
            user.Expires = refreshToken.Expires;

            await this.db.SaveChangesAsync();

            IdentityResponseModel authenticated = new IdentityResponseModel()
            {
                UserName = user.UserName,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token
            };

            return authenticated;
        }

        public async Task DeleteUser(ApplicationUser user)
        {
            user.Expires = DateTime.Now.AddHours(-2);
            user.RefreshToken = null;
            //user.Chores.Clear();

            this.db.Users.Remove(user);
            await this.db.SaveChangesAsync();
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

        public async Task EditUser(ApplicationUser user, UserEditModel model)
        {
            user.UserName = model.UserName;
            user.Email = model.Email;

            user.NormalizedUserName = model.UserName.ToUpper();
            user.NormalizedEmail = model.Email.ToUpper();

            await this.db.SaveChangesAsync();
        }

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

        public async Task<ApplicationUser> GetUserByRefreshToken(string refreshToken)
            => await this.db
            .Users
            .Where(x => x.RefreshToken == refreshToken)
            .FirstOrDefaultAsync();

        public async Task<IEnumerable<UserStatisticsResponseModel>> GetUsers()
            => await this.db
            .Users
            //.AsNoTracking()
            //.AsSplitQuery()
            .Include(x => x.Chores)
            .Select(x => new UserStatisticsResponseModel
            {
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email,
                Tasks = x.Chores.Select(c => new ChoreResponseModel
                {
                    CreatedOn = c.CreatedOn,
                    Deadline = c.Deadline,
                    Id = c.Id,
                    IsCompleted = c.IsCompleted,
                    Name = c.Name,
                    User = x.UserName
                }).ToList(),
                TaskCount = x.Chores.Count,
                TaskCompleteCount = x.Chores.Where(x => x.IsCompleted == true).Count(),
                TaskCompletePercent = (x.Chores.Count > 0
                ? x.Chores
                    .Where(t => t.IsCompleted == true).Count() * 100d / x.Chores.Count
                : 0).ToString("f2"),
                TaskIncompleteCount = x.Chores.Where(x => x.IsCompleted == false).Count(),
                TaskIncompletePercent = (x.Chores.Count > 0
                ? x.Chores
                    .Where(t => t.IsCompleted == false).Count() * 100d / x.Chores.Count
                : 0).ToString("f2"),
            })
            .ToListAsync();

        public async Task<IdentityResponseModel> RefreshToken(string refreshToken)
        {
            ApplicationUser user = await this.GetUserByRefreshToken(refreshToken);

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
