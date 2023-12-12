using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using TaskTracker.Api.Extensions;

using TaskTracker.Core.Models.Chore;
using TaskTracker.Core.Services.Contracts;

namespace TaskTracker.Api.Controllers
{
    [Authorize]
    public class ChoreController : ApiController
    {
        private readonly IChoreService choreService;

        public ChoreController(IChoreService choreService)
            => this.choreService = choreService;

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> All()
        {
            string userId = this.User.GetId();

            IEnumerable<ChoreResponseModel> response = await this.choreService.All(userId);

            if (response == null)
            {
                return BadRequest();
            }

            return Ok(response);
        }

        [HttpPost]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] ChoreRequestModel model)
        {
            string userId = this.User.GetId();

            if (await this.choreService.DoesExist(model.Name, userId))
            {
                return BadRequest();
            }

            int id = await this.choreService.Create(model, userId);

            return Created(nameof(this.Create), id);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            string userId = this.User.GetId();

            if (!await this.choreService.DoesExist(id, userId))
            {
                return NotFound();
            }

            await this.choreService.Delete(id, userId);

            return Ok();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Details([FromRoute] int id)
        {
            string userId = this.User.GetId();

            ChoreResponseModel response = await this.choreService.Details(id, userId);

            if (response == null)
            {
                return NotFound();
            }

            return Ok(response);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromBody] ChoreEditModel model)
        {
            string userId = this.User.GetId();

            if (!await this.choreService.DoesExist(id, userId))
            {
                return BadRequest();
            }

            await this.choreService.Edit(id, model, userId);

            return NoContent();
        }
    }
}
