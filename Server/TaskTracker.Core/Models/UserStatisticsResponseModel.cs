using TaskTracker.Core.Models.Chore;

namespace TaskTracker.Core.Models
{
    public class UserStatisticsResponseModel
    {
        public string Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public int TaskCount { get; set; }

        public int TaskCompleteCount { get; set; }

        public string TaskCompletePercent { get; set; }

        public int TaskIncompleteCount { get; set; }

        public string TaskIncompletePercent { get; set; }

        public ICollection<ChoreResponseModel> Tasks { get; set; } = new List<ChoreResponseModel>();
    }
}
