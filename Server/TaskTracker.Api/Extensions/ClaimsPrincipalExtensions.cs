using System.Security.Claims;

namespace TaskTracker.Api.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetId(this ClaimsPrincipal claims) 
            => claims.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
