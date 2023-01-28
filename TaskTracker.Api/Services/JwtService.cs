using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using TaskTracker.Api.Services.Contracts;

using TaskTracker.Data.Models;

namespace TaskTracker.Api.Services
{
    public class JwtService : IJwtService
    {
        private readonly AppSettings appSettings;

        public JwtService(IOptions<AppSettings> appSettings)
            => this.appSettings = appSettings.Value;

        public string GenerateToken(ApplicationUser user)
        {
            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(appSettings.Secret);

            SecurityTokenDescriptor descriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Name, user.Email)
                }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            SecurityToken token = handler.CreateToken(descriptor);
            string encToken = handler.WriteToken(token);

            return encToken;
        }
    }
}
