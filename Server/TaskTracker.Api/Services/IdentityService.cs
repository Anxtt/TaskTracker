using Microsoft.EntityFrameworkCore;

using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Models.Identity;

using TaskTracker.Data;
using TaskTracker.Data.Models;

namespace TaskTracker.Api.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly TaskTrackerDbContext db;
        private readonly IJwtService jwt;

        public IdentityService(TaskTrackerDbContext db, IJwtService jwt)
            => (this.db, this.jwt) = (db, jwt);

        public async Task<IdentityResponseModel> Authenticate(ApplicationUser user)
        {
            string token = this.jwt.GenerateToken(user);

            IdentityResponseModel authenticated = new IdentityResponseModel()
            {
                UserName = user.UserName,
                Token = token
            };

            return authenticated;
        }

        public async Task<bool> DoesExistById(string id)
            => await this.db
            .Users
            .AnyAsync(x => x.Id == id);

        public async Task<bool> DoesExistByUserName(string username)
            => await this.db
            .Users
            .AnyAsync(x => x.UserName == username);

    public async Task<ApplicationUser> GetById(string id)
            => await this.db
            .Users
            .FirstOrDefaultAsync(x => x.Id == id);

        public async Task<string> GetUserNameById(string id)
            => await GetQueryableUser(id)
            .Select(x => x.UserName)
            .FirstAsync();

        private IQueryable<ApplicationUser> GetQueryableUser(string id)
            => this.db
            .Users
            .Where(x => x.Id == id);
    }
}
