using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Models.Identity;

using TaskTracker.Data.Models;

namespace TaskTracker.Api.Controllers
{
    [AllowAnonymous]
    public class IdentityController : ApiController
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;

        private readonly IIdentityService users;

        public IdentityController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IIdentityService users)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.users = users;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<IActionResult> Register([FromBody] IdentityRegisterModel model)
        {
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<IActionResult> Login([FromBody] IdentityLoginModel model)
        {
            ApplicationUser user = await userManager.FindByNameAsync(model.UserName);   

            if (user == null || !await userManager.CheckPasswordAsync(user, model.Password))
            {
                return BadRequest();
            }

            IdentityResponseModel authenticated = await this.users.Authenticate(user);
            await signInManager.SignInAsync(user, false);

            return Ok(authenticated);
        }
    }
}
