using Microsoft.Extensions.Options;

using Microsoft.IdentityModel.Tokens;

using System.IdentityModel.Tokens.Jwt;

using System.Security.Claims;
using System.Security.Cryptography;

using System.Text;

using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Models;

using TaskTracker.Data.Models;

namespace TaskTracker.Api.Services
{
    public class JwtService : IJwtService
    {
        private readonly ILogger<JwtService> logger;
        private readonly AppSettings appSettings;

        public JwtService(IOptions<AppSettings> appSettings, ILogger<JwtService> logger)
        {
            this.logger = logger;
            this.appSettings = appSettings.Value;
        }

        public string GenerateToken(ApplicationUser user)
        {
            byte[] key = Encoding.ASCII.GetBytes(this.appSettings.Secret);

            SigningCredentials signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature);

            SecurityTokenDescriptor descriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Name, user.Email)
                }),
                Expires = DateTime.Now.AddMinutes(30),
                Issuer = this.appSettings.Issuer,
                Audience = this.appSettings.Audience[1],
                SigningCredentials = signingCredentials
            };

            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();

            SecurityToken token = handler.CreateToken(descriptor);
            string encToken = handler.WriteToken(token);

            return encToken;
        }

        public RefreshTokenModel GenerateRefreshToken()
        {
            RefreshTokenModel refreshToken = new RefreshTokenModel()
            {
                Token = this.GetUniqueToken(),
                Expires = DateTime.Now.AddMinutes(60),
                Created = DateTime.Now
            };

            return refreshToken;
        }

        public ClaimsPrincipal ValidateToken(string currentToken)
        {
            byte[] key = Encoding.ASCII.GetBytes(this.appSettings.Secret);

            TokenValidationParameters validationParameters = new TokenValidationParameters()
            {
                ValidateAudience = true,
                ValidAudiences = this.appSettings.Audience,

                ValidateIssuer = true,
                ValidIssuer = this.appSettings.Issuer,

                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };

            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            ClaimsPrincipal principal;

            try
            {
                principal = handler.ValidateToken(currentToken, validationParameters, out SecurityToken securityToken);

                JwtSecurityToken token = securityToken as JwtSecurityToken;

                if (token is null ||
                    token.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase) is false)
                {
                    this.logger.LogInformation("Token: {Token} is either null or invalid.", token);
                    return default;
                }
            }
            catch (Exception e)
            {
                this.logger.LogError(e, "Error occured: {Message}", e.Message);
                this.logger.LogInformation(e, "Stack trace: {StackTrace}", e.StackTrace);
                return default;
            }

            return principal;
        }

        private string GetUniqueToken()
        {
            byte[] randomNumber = new byte[32];

            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }
}
