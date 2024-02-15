using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using TaskTracker.Api.Extensions;
using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Models.Identity;

using TaskTracker.Data.Models;

namespace TaskTracker.Api.Controllers
{
    public class IdentityController : ApiController
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;

        private readonly IIdentityService identityService;

        public IdentityController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IIdentityService identityService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.identityService = identityService;
        }

        // Add caching for this and ByEmail, because a request is sent on every input blur call
        [HttpGet("{username}")]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DoesExistByUserName([FromRoute] string username)
            => string.IsNullOrWhiteSpace(username) ||
               await this.identityService.DoesExistByUserName(username) == false
                ? this.Ok(false)
                : this.BadRequest(true);

        [HttpGet("{email}")]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DoesExistByEmail([FromRoute] string email)
            => string.IsNullOrWhiteSpace(email) ||
               await this.identityService.DoesExistByEmail(email) == false
                ? this.Ok(false)
                : this.BadRequest(true);

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

            if (!result.Succeeded)
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
                !await userManager.CheckPasswordAsync(user, model.Password))
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

            return SignOut();
        }

        [HttpGet]
        [Authorize]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> VerifyUser()
        {
            // 1.
            // maybe cache this, up to 10 minutes before token expiry
            // will have to manage token on log out
            string username = await this.identityService.GetUserNameById(this.User.GetId());

            return Ok(new IdentityResponseModel()
            {
                UserName = username,
                Token = this.HttpContext.Request.Cookies[".AspNetCore.Application.Verified"]!
            });
        }
    }
}
