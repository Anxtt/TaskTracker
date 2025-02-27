﻿using Microsoft.EntityFrameworkCore;

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
                        CreatedOn = x.CreatedOn.Date,
                        Deadline = x.Deadline.Date,
                        IsCompleted = x.IsCompleted,
                        User = x.User.UserName,
                        UserId = x.UserId
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
                Deadline = model.Deadline,
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
        public async Task<string> Delete(int id, string userId)
        {
            Chore chore = await GetChoreByUser(id, userId);

            this.db.Chores.Remove(chore);
            await this.db.SaveChangesAsync();

            return chore.Name;
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
                        CreatedOn = x.CreatedOn.Date,
                        Deadline = x.Deadline.Date,
                        IsCompleted = x.IsCompleted,
                        User = x.User.UserName,
                        UserId = x.UserId
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
            chore.Deadline = model.Deadline;
            chore.IsCompleted = model.IsCompleted;

            await this.db.SaveChangesAsync();
        }

        /// <summary>
        /// Filters and orders an <see cref="IEnumerable{ChoreResponseModel}"/> <paramref name="models"/>
        /// collection of type <see cref="ChoreResponseModel"/> according to <paramref name="isCompleted"/>,
        /// <paramref name="sort"/>, and <paramref name="filter"/> which is then returned.
        /// </summary>
        /// <param name="models"></param>
        /// <param name="isCompleted"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns>
        /// <see cref="IEnumerable{ChoreResponseModel}"/> collection of type <see cref="ChoreResponseModel"/>.
        /// </returns>
        public IEnumerable<ChoreResponseModel> FilteredTasks(
            IEnumerable<ChoreResponseModel> models,
            bool? isCompleted,
            string sort,
            string filter)
        {
            if (isCompleted is not null)
            {
                models = models
                    .Where(x => x.IsCompleted == isCompleted);
            }

            if (string.IsNullOrWhiteSpace(filter) is false)
            {
                models = models
                    .Where(x => x.Name.Contains(filter));
            }

            if (string.IsNullOrWhiteSpace(sort) is false)
            {
                models = sort == "creation ASC"
                    ? models
                        .OrderBy(x => x.CreatedOn)
                    : sort == "creation DESC"
                        ? models
                            .OrderByDescending(x => x.CreatedOn)
                        : sort == "deadline ASC"
                            ? models
                                .OrderBy(x => x.Deadline)
                            : models
                                .OrderByDescending(x => x.Deadline);
            }

            return models.ToList();
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
