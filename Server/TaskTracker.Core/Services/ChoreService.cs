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

        public async Task<IEnumerable<ChoreResponseModel>> All(string userId)
            => await this.db.Chores
                    .Where(x => x.UserId == userId)
                    .Select(x => new ChoreResponseModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        CreatedOn = x.CreatedOn.Date.ToString("d MMM yyyy"),
                        UpdatedOn = x.UpdatedOn.Date.ToString("d MMM yyyy"),
                        IsCompleted = x.IsCompleted,
                        User = x.User.UserName
                    })
                    .ToListAsync();

        public async Task<int> Create(ChoreRequestModel model, string userId)
        {
            Chore chore = new Chore()
            {
                Name = model.Name,
                IsCompleted = model.IsCompleted,
                UserId = userId
            };

            await this.db.Chores.AddAsync(chore);
            await this.db.SaveChangesAsync();

            return chore.Id;
        }

        public async Task Delete(int id, string userId)
        {
            Chore chore = await GetChoreByUser(id, userId);

            this.db.Chores.Remove(chore);
            await this.db.SaveChangesAsync();
        }

        public async Task<ChoreResponseModel> Details(int id, string userId)
            => await this.db.Chores
                    .Where(x => x.Id == id && x.UserId == userId)
                    .Select(x => new ChoreResponseModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        CreatedOn = x.CreatedOn.Date.ToString("d MMM yyyy"),
                        UpdatedOn = x.UpdatedOn.Date.ToString("d MMM yyyy"),
                        IsCompleted = x.IsCompleted,
                        User = x.User.UserName
                    })
                    .FirstOrDefaultAsync();

        public async Task<bool> DoesExist(string name, string userId)
            => await this.db.Chores
                    .AnyAsync(x => x.UserId == userId && x.Name == name);

        public async Task<bool> DoesExist(int id, string userId)
            => await this.db.Chores
               .AnyAsync(x => x.UserId == userId && x.Id == id);

        public async Task Edit(int id, ChoreEditModel model, string userId)
        {
            Chore chore = await GetChoreByUser(id, userId);

            chore.UpdatedOn = DateTime.Parse(model.UpdatedOn);
            chore.IsCompleted = model.IsCompleted;

            await this.db.SaveChangesAsync();
        }

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
