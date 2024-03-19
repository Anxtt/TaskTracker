using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using Microsoft.Extensions.Caching.Memory;

using TaskTracker.Api.Extensions;
using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Models.Identity;

using TaskTracker.Data.Models;

namespace TaskTracker.Api.Controllers
{
    public class IdentityController : ApiController
    {
        private const string AUTH_CACHE_KEY = $"AuthCache-{{0}}";

        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IMemoryCache cache;

        private readonly IIdentityService identityService;

        public IdentityController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IIdentityService identityService,
            IMemoryCache cache)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.cache = cache;

            this.identityService = identityService;
        }

        [HttpGet("{username}")]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DoesExistByUserName([FromRoute] string username)
        {
            if (string.IsNullOrWhiteSpace(username) == true)
            {
                return this.BadRequest(true);
            }

            bool doesExist = await this.cache.ShortCacheUserName(
                $"{nameof(this.DoesExistByUserName)}-{username}",
                username,
                this.identityService);

            return doesExist == false
                        ? this.Ok(false)
                        : this.BadRequest(true);
        }

        [HttpGet("{email}")]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DoesExistByEmail([FromRoute] string email)
        {
            if (string.IsNullOrWhiteSpace(email) == true)
            {
                return this.BadRequest(true);
            }

            bool doesExist = await this.cache.ShortCacheEmail(
                $"{nameof(this.DoesExistByEmail)}-{email}",
                email,
                this.identityService);

            return doesExist == false
                    ? this.Ok(false)
                    : this.BadRequest(true);
        }

        [HttpPost]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] IdentityRegisterModel model)
        {
            if (this.ModelState.IsValid == false)
            {
                return BadRequest(this.ModelState);
            }

            ApplicationUser user = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded == false)
            {
                return BadRequest(result.Errors);
            }

            return Created(nameof(Register), user.Id);
        }

        [HttpPost]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] IdentityLoginModel model)
        {
            if (this.ModelState.IsValid == false)
            {
                return BadRequest(this.ModelState);
            }

            ApplicationUser user = await userManager.FindByNameAsync(model.UserName);

            if (user == null ||
                await userManager.CheckPasswordAsync(user, model.Password) == false)
            {
                return BadRequest();
            }

            IdentityResponseModel authenticated = await this.identityService.Authenticate(user);
            await signInManager.SignInAsync(user, false);

            this.HttpContext
                .Response
                .Cookies
                .Append(".AspNetCore.Application.Verified", authenticated.Token, new CookieOptions()
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.Now.AddDays(1),
                    Path = "/",
                    Domain = "localhost"
                });

            this.HttpContext
                .Response
                .Cookies
                .Append(".AspNetCore.Application.Cookie", "true", new CookieOptions()
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.Now.AddDays(1),
                    Path = "/",
                    Domain = "localhost"
                });

            return Ok(authenticated);
        }

        [HttpPost]
        [Authorize]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Logout()
        {
            this.HttpContext
                .Response
                .Cookies
                .Delete(".AspNetCore.Application.Verified");

            this.HttpContext
                .Response
                .Cookies
                .Delete(".AspNetCore.Application.Cookie");

            await this.signInManager.SignOutAsync();

            this.cache.Remove(string.Format(AUTH_CACHE_KEY, this.User.GetId()));

            return SignOut();
        }

        [HttpGet]
        [Authorize]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> VerifyUser()
        {
            string token = this.HttpContext.Request.Cookies[".AspNetCore.Application.Verified"]!;
            string userId = this.User.GetId();

            IdentityResponseModel authenticated = await this.cache.ShortCacheAuth(
                string.Format(AUTH_CACHE_KEY, userId),
                userId,
                token,
                this.identityService);

            return this.Ok(authenticated);
        }
    }
}
