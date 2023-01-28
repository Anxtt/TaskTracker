using TaskTracker.Data.Models;

namespace TaskTracker.Api.Services.Contracts
{
    public interface IJwtService
    {
        string GenerateToken(ApplicationUser user);
    }
}
