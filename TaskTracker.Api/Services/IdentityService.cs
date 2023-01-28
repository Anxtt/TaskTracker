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

        public async Task<ApplicationUser> GetById(string id)
            => await db.Users
                    .FirstOrDefaultAsync(x => x.Id == id);
    }
}
