using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using Microsoft.Extensions.Caching.Memory;

using System.Security.Claims;

using TaskTracker.Api.Extensions;
using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Models.Identity;
using TaskTracker.Data.Models;

using static TaskTracker.Core.Constants.Web.Identity;

namespace TaskTracker.Api.Controllers
{
    public class IdentityController : ApiController
    {
        private readonly ILogger<IdentityController> logger;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IMemoryCache cache;

        private readonly IIdentityService identityService;
        private readonly IJwtService jwtService;

        public IdentityController(
            ILogger<IdentityController> logger,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IIdentityService identityService,
            IMemoryCache cache,
            IJwtService jwtService)
        {
            this.logger = logger;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.cache = cache;

            this.identityService = identityService;
            this.jwtService = jwtService;
        }

        [HttpGet("{username}")]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DoesExistByUserName([FromRoute] string username)
        {
            if (string.IsNullOrWhiteSpace(username) is true)
            {
                return this.BadRequest("Name cannot be empty.");
            }

            bool doesExist = await this.cache
                .ShortCacheUserName(username, this.identityService);

            return doesExist is false
                        ? this.Ok(false)
                        : this.Ok(true);
        }

        [HttpGet("{email}")]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DoesExistByEmail([FromRoute] string email)
        {
            if (string.IsNullOrWhiteSpace(email) is true)
            {
                return this.BadRequest("E-mail cannot be empty.");
            }

            bool doesExist = await this.cache
                .ShortCacheEmail(email, this.identityService);

            return doesExist is false
                    ? this.Ok(false)
                    : this.Ok(true);
        }

        [HttpPost]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] IdentityRegisterModel model)
        {
            ApplicationUser user = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded is false)
            {
                return this.BadRequest(result.Errors.Select(x => x.Description));
            }

            return this.Created(nameof(Register), user.Id);
        }

        [HttpPost]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] IdentityLoginModel model)
        {
            ApplicationUser user = await userManager.FindByNameAsync(model.UserName);

            if (user is null ||
                await userManager.CheckPasswordAsync(user, model.Password) is false)
            {
                return this.BadRequest("Invalid Credentials");
            }

            IdentityResponseModel authModel = await this.identityService.Authenticate(user);
            await signInManager.SignInAsync(user, false);

            this.SetAuthCookies(authModel);

            return this.Ok(authModel);
        }

        [HttpPost]
        [Authorize]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Logout()
        {
            this.DeleteAuthCookies();

            await this.signInManager.SignOutAsync();

            this.cache.Remove(string.Format(AUTH_CACHE_KEY, this.User.GetId()));

            return this.SignOut();
        }

        [HttpGet]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken()
        {
            string accessToken = this.HttpContext.Request.Cookies[".AspNetCore.Application.Verified"]!;
            string refreshToken = this.HttpContext.Request.Cookies[".AspNetCore.Application.Refresh"]!;
            IdentityResponseModel model;

            try
            {
                model = await this.identityService.RefreshToken(refreshToken, accessToken);
                this.SetAuthCookies(model);
            }
            catch (Exception e)
            {
                this.logger.LogError(e, "Error occured: {Message}", e.Message);
                this.logger.LogInformation(e, "Stack trace: {StackTrace}", e.StackTrace);

                this.DeleteAuthCookies();
                return this.Unauthorized("Your session has expired.");
            }

            return this.Ok(model);
        }

        [HttpGet]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> VerifyUser()
        {
            string accessToken = this.HttpContext.Request.Cookies[".AspNetCore.Application.Verified"]!;
            string refreshToken = this.HttpContext.Request.Cookies[".AspNetCore.Application.Refresh"]!;

            IdentityResponseModel model = new IdentityResponseModel();

            try
            {
                if (accessToken is null && refreshToken is null)
                {
                    await this.Logout();
                    return this.Unauthorized("Your session has expired.");
                }

                if ((accessToken is null || this.jwtService.ValidateToken(accessToken) is default(ClaimsPrincipal)) &&
                    refreshToken is not null)
                {
                    return this.RedirectToAction(nameof(IdentityController.RefreshToken));
                }

                ApplicationUser user = await this.identityService.GetUserByRefreshToken(refreshToken, accessToken);

                if (user is null)
                {
                    return this.Unauthorized("Your session has expired.");
                }

                model = await this.cache
                    .ShortCacheAuth(user.Id, accessToken, refreshToken, this.identityService);
            }
            catch (Exception e)
            {
                this.logger.LogError(e, "Error occured: {Message}", e.Message);
                this.logger.LogInformation(e, "Stack trace: {StackTrace}", e.StackTrace);

                this.DeleteAuthCookies();

                return this.Problem(detail: "Try again later!", title: "Internal Server Error.", statusCode: 500);
            }

            return this.Ok(model);
        }

        [NonAction]
        private void SetAuthCookies(IdentityResponseModel model)
        {
            this.HttpContext
                .Response
                .Cookies
                .Append(".AspNetCore.Application.Verified", model.AccessToken, new CookieOptions()
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.Now.AddMinutes(30),
                    Path = "/",
                    Domain = "localhost"
                });

            this.HttpContext
               .Response
               .Cookies
               .Append(".AspNetCore.Application.Refresh", model.RefreshToken, new CookieOptions()
               {
                   HttpOnly = true,
                   Secure = true,
                   SameSite = SameSiteMode.None,
                   Expires = DateTime.Now.AddMinutes(60),
                   Path = "/",
                   Domain = "localhost"
               });
        }

        [NonAction]
        private void DeleteAuthCookies()
        {
            this.HttpContext
                .Response
                .Cookies.Delete(".AspNetCore.Application.Verified");

            this.HttpContext
                .Response
                .Cookies.Delete(".AspNetCore.Application.Refresh");
        }
    }
}
