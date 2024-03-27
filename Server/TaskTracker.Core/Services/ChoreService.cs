using Microsoft.EntityFrameworkCore;

using TaskTracker.Core.Models.Chore;
using TaskTracker.Core.Services.Contracts;

using TaskTracker.Data;
using TaskTracker.Data.Models;

namespace TaskTracker.Core.Services
{
    public class ChoreService : IChoreService
    {
        private readonly TaskTrackerDbContext db;

        public ChoreService(TaskTrackerDbContext db)
            => this.db = db;

        /// <summary>
        /// Queries all <see cref="Chore"/>s with the given argument <paramref name="userId"/>
        /// which are then translated into an <see cref="IEnumerable{ChoreResponseModel}"/> collection 
        /// of type <see cref="ChoreResponseModel"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userId"></param>
        /// <returns>
        /// <see cref="IEnumerable{ChoreResponseModel}"/> collection of type <see cref="ChoreResponseModel"/>.
        /// </returns>
        public async Task<IEnumerable<ChoreResponseModel>> All(string userId)
            => await this.db.Chores
                    .Where(x => x.UserId == userId)
                    .Select(x => new ChoreResponseModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        CreatedOn = x.CreatedOn.Date.ToString("d-MM-yyyy"),
                        Deadline = x.Deadline.Date.ToString("d-MM-yyyy"),
                        IsCompleted = x.IsCompleted,
                        User = x.User.UserName
                    })
                    .ToListAsync();

        /// <summary>
        /// Creates a new <see cref="Chore"/> with the properties of <see cref="ChoreRequestModel"/> <paramref name="model"/>
        /// for the given <see cref="ApplicationUser"/> with <paramref name="userId"/> and 
        /// adds it to <see cref="TaskTrackerDbContext"/>.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="userId"></param>
        /// <returns>
        /// The Id of the newly created <see cref="Chore"/>.
        /// </returns>
        public async Task<int> Create(ChoreRequestModel model, string userId)
        {
            Chore chore = new Chore()
            {
                Name = model.Name,
                Deadline = DateTime.Parse(model.Deadline, null),
                UserId = userId
            };

            await this.db.Chores.AddAsync(chore);
            await this.db.SaveChangesAsync();

            return chore.Id;
        }

        /// <summary>
        /// Deletes a <see cref="Chore"/> with the given <paramref name="id"/> for a <see cref="ApplicationUser"/>
        /// with the given <paramref name="userId"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task Delete(int id, string userId)
        {
            Chore chore = await GetChoreByUser(id, userId);

            this.db.Chores.Remove(chore);
            await this.db.SaveChangesAsync();
        }

        /// <summary>
        /// Queries the first <see cref="Chore"/> with the given arguments <paramref name="id"/> and <paramref name="userId"/>
        /// which is then translated into a <see cref="ChoreResponseModel"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userId"></param>
        /// <returns>
        /// <see cref="ChoreResponseModel"/>
        /// </returns>
        public async Task<ChoreResponseModel> Details(int id, string userId)
            => await this.db.Chores
                    .Where(x => x.Id == id && x.UserId == userId)
                    .Select(x => new ChoreResponseModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        CreatedOn = x.CreatedOn.Date.ToString("d-MM-yyyy"),
                        Deadline = x.Deadline.Date.ToString("d-MM-yyyy"),
                        IsCompleted = x.IsCompleted,
                        User = x.User.UserName
                    })
                    .FirstOrDefaultAsync();

        /// <summary>
        /// Checks if an <see cref="ApplicationUser"/> with the given <paramref name="userId"/> 
        /// has a task with the given <see cref="Chore"/> <paramref name="name"/>.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="userId"></param>
        /// <returns>
        /// A <see cref="bool"/> value on the executed query with parameters <paramref name="name"/> and <paramref name="userId"/>.
        /// </returns>
        public async Task<bool> DoesExist(string name, string userId)
            => await this.db.Chores
                    .AnyAsync(x => x.UserId == userId && x.Name == name);

        /// <summary>
        /// Checks if an <see cref="ApplicationUser"/> with the given <paramref name="userId"/>
        /// has a task with the given <see cref="Chore"/> <paramref name="id"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userId"></param>
        /// <returns>
        /// A <see cref="bool"/> value on the executed query with parameters <paramref name="id"/> and <paramref name="userId"/>.
        /// </returns>
        public async Task<bool> DoesExist(int id, string userId)
            => await this.db.Chores
               .AnyAsync(x => x.UserId == userId && x.Id == id);

        /// <summary>
        /// Updates a <see cref="Chore"/> with the given <paramref name="id"/> for an <see cref="ApplicationUser"/>
        /// with the given <paramref name="userId"/> to the properties held in the <see cref="ChoreEditModel"/> <paramref name="model"/>
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task Edit(int id, ChoreEditModel model, string userId)
        {
            Chore chore = await GetChoreByUser(id, userId);

            chore.Name = model.Name;
            chore.Deadline = DateTime.Parse(model.Deadline);
            chore.IsCompleted = model.IsCompleted;

            await this.db.SaveChangesAsync();
        }
        /// <summary>
        /// Queries all <see cref="Chore"/>s with the given argument <paramref name="userId"/>
        /// filtered or ordered according to <paramref name="isCompleted"/>, <paramref name="sort"/>, and
        /// <paramref name="filter"/> which are then translated into an 
        /// <see cref="IEnumerable{ChoreResponseModel}"/> collection of type <see cref="ChoreResponseModel"/>.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="isCompleted"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns>
        /// <see cref="IEnumerable{ChoreResponseModel}"/> collection of type <see cref="ChoreResponseModel"/>.
        /// </returns>
        public async Task<IEnumerable<ChoreResponseModel>> FilteredTasks(
            string userId,
            bool? isCompleted,
            string sort,
            string filter)
        {
            IQueryable<Chore> chores = this.db.Chores
                .Where(x => x.UserId == userId);

            if (isCompleted is not null)
            {
                chores = chores
                    .Where(x => x.IsCompleted == isCompleted);
            }

            if (string.IsNullOrWhiteSpace(filter) == false)
            {
                chores = chores
                    .Where(x => x.Name.Contains(filter));
            }

            if (string.IsNullOrWhiteSpace(sort) == false)
            {
                chores = sort == "creation ASC"
                    ? chores
                        .OrderBy(x => x.CreatedOn)
                    : sort == "creation DESC"
                        ? chores
                            .OrderByDescending(x => x.CreatedOn)
                        : sort == "deadline ASC"
                            ? chores
                                .OrderBy(x => x.Deadline)
                            : chores
                                .OrderByDescending(x => x.Deadline);
            }

            return await chores
                            .Select(x => new ChoreResponseModel()
                            {
                                CreatedOn = x.CreatedOn.ToString("d-MM-yyyy"),
                                Deadline = x.Deadline.ToString("d-MM-yyyy"),
                                Id = x.Id,
                                IsCompleted = x.IsCompleted,
                                Name = x.Name,
                                User = x.User.UserName
                            })
                            .ToListAsync();
        }

        /// <summary>
        /// Query the first <see cref="Chore"/> with the given parameters <paramref name="id"/> and <paramref name="userId"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userId">userId</param>
        /// <returns>
        /// A data model of type <see cref="Chore"/>.
        /// </returns>
        private async Task<Chore> GetChoreByUser(int id, string userId)
             => await this.db
                         .Chores
                         .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

        private async Task ReseedId()
        {
            int idToReseed = default;
            string command = $"DBCC CHECKIDENT('TaskTracker.dbo.Chores', RESEED, {idToReseed})";

            if (await this.db.Chores.CountAsync() != 0)
            {
                idToReseed = await this.db.Chores.MaxAsync(x => x.Id);
            }

            await this.db.Database.ExecuteSqlRawAsync(command);
        }
    }
}
