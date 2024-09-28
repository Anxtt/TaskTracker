using System.Security.Claims;

using TaskTracker.Core.Models;

using TaskTracker.Data.Models;

namespace TaskTracker.Api.Services.Contracts
{
    public interface IJwtService
    {
        string GenerateToken(ApplicationUser user, string[] roles);

        RefreshTokenModel GenerateRefreshToken();

        ClaimsPrincipal ValidateToken(string currentToken);
    }
}
