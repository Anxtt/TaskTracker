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
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> All()
        {
            IEnumerable<ChoreResponseModel> response = await this.GetOrCacheTasks();

            return response.Any() is false
                ? this.NoContent()
                : this.Ok(response);
        }

        [HttpGet]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> AllFiltered(
            [FromQuery] bool? isCompletedStatus,
            [FromQuery] string? sortStatus,
            [FromQuery] string? filterStatus)
        {
            IEnumerable<ChoreResponseModel> chores = await this.GetOrCacheTasks();

            IEnumerable<ChoreResponseModel> response = this.choreService
                .FilteredTasks(chores, isCompletedStatus, sortStatus!, filterStatus!);

            return response.Any() is false
                ? this.NoContent()
                : this.Ok(response);
        }

        [HttpPost]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] ChoreRequestModel model)
        {
            if (await this.cache
                .ShortCacheTaskNameByName(model.Name, model.UserId, this.choreService) is true)
            {
                return this.BadRequest("You already have a task with this name.");
            }

            int id = await this.choreService.Create(model, model.UserId);

            this.RemoveCachedTasks(model.UserId, null!, null!);
            this.cache.Set(
                string.Format(TASK_NAME_CACHE_KEY, model.UserId, model.Name),
                true, TimeSpan.FromMinutes(1));

            return this.Created(nameof(this.Create), id);
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete([FromRoute] int id, [FromQuery] string userId)
        {
            if (await this.choreService.DoesExist(id, userId) is false)
            {
                return this.NotFound("Task with such id was not found.");
            }

            string taskName = await this.choreService.Delete(id, userId);

            this.RemoveCachedTasks(userId, taskName, null!);

            return this.Ok();
        }

        [HttpGet("{name}")]
        [ProducesDefaultResponseType]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DoesExistByName([FromRoute] string name, [FromQuery] string userId)
        {
            if (string.IsNullOrWhiteSpace(name) is true)
            {
                return this.BadRequest("You already have a task with this name.");
            }

            bool doesExist = await this.cache
                .ShortCacheTaskNameByName(name, userId, this.choreService);

            return this.Ok(doesExist);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Details([FromRoute] int id)
        {
            string userId = this.User.GetId();

            ChoreResponseModel response = await this.choreService.Details(id, userId);

            if (response is null)
            {
                return this.NotFound("Task with such id was not found.");
            }

            return this.Ok(response);
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromBody] ChoreEditModel model)
        {
            if (await this.choreService.DoesExist(id, model.UserId) is false)
            {
                return this.NotFound("Task with such id was not found");
            }

            //if (model.Deadline.Date < DateTime.Now.Date)
            //{
            //   return this.BadRequest("Date is invalid");
            //}

            await this.choreService.Edit(id, model, model.UserId);

            this.RemoveCachedTasks(model.UserId, model.Name, model.OldName);

            return this.Ok();
        }

        [NonAction]
        private async Task<IEnumerable<ChoreResponseModel>> GetOrCacheTasks()
        {
            string userId = this.User.GetId();

            return await this.cache
                .ShortCacheTasksByUserId(userId, this.choreService);
        }

        [NonAction]
        private void RemoveCachedTasks(string userId, string taskName, string oldTaskName)
        {
            this.cache.Remove(string.Format(
                USER_TASKS_CACHE_KEY, userId));

            if (taskName is not null)
            {
                this.cache.Remove(string.Format(TASK_NAME_CACHE_KEY, userId, taskName));
            }

            if (oldTaskName is not null)
            {
                this.cache.Remove(string.Format(TASK_NAME_CACHE_KEY, userId, oldTaskName));
            }
        }
    }
}
