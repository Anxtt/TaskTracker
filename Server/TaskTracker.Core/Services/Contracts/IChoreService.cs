﻿using TaskTracker.Core.Models.Chore;

namespace TaskTracker.Core.Services.Contracts
{
    public interface IChoreService
    {
        Task<IEnumerable<ChoreResponseModel>> All(string userId);

        Task<int> Create(ChoreRequestModel model, string userId);

        Task Delete(int id, string userId);

        Task<ChoreResponseModel> Details(int id, string userId);
    
        Task<bool> DoesExist(int id, string userId);

        Task<bool> DoesExist(string name, string userId);

        Task Edit(int id, ChoreEditModel model, string userId);
    }
}
