namespace TaskTracker.Core.Models.Chore
{
    public class ChoreResponseModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime Deadline { get; set; }

        public bool IsCompleted { get; set; }

        public string User { get; set; }
    }
}
