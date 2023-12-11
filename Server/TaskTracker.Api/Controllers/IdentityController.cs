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

        [HttpPost]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] IdentityRegisterModel model)
        {
            //Password && Name validation check

            ApplicationUser user = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest();
            }

            return Created(nameof(Register), user.Id);
        }

        [HttpPost]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] IdentityLoginModel model)
        {
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
                    SameSite = SameSiteMode.Lax,
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
                    SameSite = SameSiteMode.Lax,
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
            string username = await this.identityService.GetUserNameById(this.User.GetId());

            return Ok(new IdentityResponseModel()
            {
                UserName = username,
                Token = this.HttpContext.Request.Cookies[".AspNetCore.Application.Verified"]!
            });
        }
    }
}
