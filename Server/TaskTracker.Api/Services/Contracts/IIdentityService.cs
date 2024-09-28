using TaskTracker.Core.Models;
using TaskTracker.Core.Models.Identity;

using TaskTracker.Data.Models;

namespace TaskTracker.Api.Services.Contracts
{
    public interface IIdentityService
    {
        Task<IdentityResponseModel> Authenticate(ApplicationUser user);

        Task DeleteUser(ApplicationUser user);

        Task<bool> DoesExistById(string id);

        Task<bool> DoesExistByUserName(string username);

        Task<bool> DoesExistByEmail(string email);

        Task EditUser(ApplicationUser user, UserEditModel model);

        Task<ApplicationUser> GetById(string id);

        Task<string> GetUserNameById(string id);

        Task<IEnumerable<UserStatisticsResponseModel>> GetUsers(string id);

        Task<ApplicationUser> GetUserByRefreshToken(string refresh);

        Task<IdentityResponseModel> RefreshToken(string refreshToken);
    }
}