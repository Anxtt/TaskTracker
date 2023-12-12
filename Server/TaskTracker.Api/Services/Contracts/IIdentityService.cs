using TaskTracker.Core.Models.Identity;

using TaskTracker.Data.Models;

namespace TaskTracker.Api.Services.Contracts
{
    public interface IIdentityService
    {
        Task<IdentityResponseModel> Authenticate(ApplicationUser user);

        Task<bool> DoesExistById(string id);

        Task<bool> DoesExistByUserName(string username);

        Task<ApplicationUser> GetById(string id);

        Task<string> GetUserNameById(string id);
    }
}