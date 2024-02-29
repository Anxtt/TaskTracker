namespace TaskTracker.Core.Models.Chore
{
    public class ChoreResponseModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string CreatedOn { get; set; }

        public string Deadline { get; set; }

        public bool IsCompleted { get; set; }

        public string User { get; set; }
    }
}
