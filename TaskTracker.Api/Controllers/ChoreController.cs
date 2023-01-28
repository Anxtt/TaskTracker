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
        private readonly IChoreService chores;

        public ChoreController(IChoreService chores)
            => this.chores = chores;

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> All()
        {
            string userId = this.User.GetId();

            IEnumerable<ChoreResponseModel> response = await this.chores.All(userId);

            if (response == null)
            {
                return BadRequest();
            }

            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public async Task<IActionResult> Create([FromBody] ChoreRequestModel model)
        {
            string userId = this.User.GetId();

            if (await this.chores.DoesExist(model.Name, userId))
            {
                return BadRequest();
            }

            int id = await this.chores.Create(model, userId);

            return Created(nameof(this.Create), id);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            string userId = this.User.GetId();

            if (!await this.chores.DoesExist(id, userId))
            {
                return NotFound();
            }

            await this.chores.Delete(id, userId);

            return Ok();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Details(int id)
        {
            string userId = this.User.GetId();

            ChoreResponseModel response = await this.chores.Details(id, userId);

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

            if (!await this.chores.DoesExist(id, userId))
            {
                return BadRequest();
            }

            await this.chores.Edit(id, model.UpdatedOn, userId);

            return NoContent();
        }
    }
}
