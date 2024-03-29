using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Microsoft.Extensions.Caching.Memory;

using TaskTracker.Api.Extensions;

using TaskTracker.Core.Models.Chore;
using TaskTracker.Core.Services.Contracts;

using static TaskTracker.Core.Constants.Web.Task;

namespace TaskTracker.Api.Controllers
{
    [Authorize]
    public class ChoreController : ApiController
    {
        private readonly IMemoryCache cache;

        private readonly IChoreService choreService;

        public ChoreController(IChoreService choreService, IMemoryCache cache)
        {
            this.choreService = choreService;
            this.cache = cache;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> All()
        {
            IEnumerable<ChoreResponseModel> response = await this.GetOrCacheTasks();

            if (response.Count() == 0)
            {
                return BadRequest();
            }

            return Ok(response);
        }

        [HttpGet]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AllFiltered(
            [FromQuery] bool? isCompletedStatus,
            [FromQuery] string? sortStatus,
            [FromQuery] string? filterStatus)
        {
            IEnumerable<ChoreResponseModel> chores = await this.GetOrCacheTasks();

            if (chores.Count() == 0)
            {
                return this.BadRequest();
            }

            IEnumerable<ChoreResponseModel> response = this.choreService
                .FilteredTasks(chores, isCompletedStatus, sortStatus!, filterStatus!);

            return this.Ok(response);
        }

        [HttpPost]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] ChoreRequestModel model)
        {
            string userId = this.User.GetId();

            if (await this.cache
                .ShortCacheTaskNameByName(model.Name, userId, this.choreService) == true)
            {
                return BadRequest();
            }

            int id = await this.choreService.Create(model, userId);

            this.RemoveCachedTasks(userId);

            return Created(nameof(this.Create), id);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            string userId = this.User.GetId();

            if (await this.choreService.DoesExist(id, userId) == false)
            {
                return NotFound();
            }

            await this.choreService.Delete(id, userId);

            this.RemoveCachedTasks(userId);

            return Ok();
        }

        [HttpGet("{name}")]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DoesExistByName([FromRoute] string name)
        {
            if (string.IsNullOrWhiteSpace(name) == true)
            {
                return this.BadRequest(true);
            }

            string userId = this.User.GetId();

            bool doesExist = await this.cache
                .ShortCacheTaskNameByName(name, userId, this.choreService);

            return doesExist == false
                    ? this.Ok(false)
                    : this.BadRequest(true);
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

            if (await this.choreService.DoesExist(id, userId) == false)
            {
                return BadRequest();
            }

            await this.choreService.Edit(id, model, userId);

            this.RemoveCachedTasks(userId);

            return NoContent();
        }

        [NonAction]
        private async Task<IEnumerable<ChoreResponseModel>> GetOrCacheTasks()
        {
            string userId = this.User.GetId();
            string username = this.User.Identity!.Name!;

            return await this.cache
                .ShortCacheTasksByUserId(userId, username, this.choreService);
        }

        [NonAction]
        private void RemoveCachedTasks(string userId)
        {
            string username = this.User.Identity!.Name!;

            this.cache.Remove(string.Format(
                USER_TASKS_CACHE_KEY, userId, username));
        }
    }
}
