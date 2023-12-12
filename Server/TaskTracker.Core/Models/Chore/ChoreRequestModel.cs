using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Core.Models.Chore
{
    public class ChoreRequestModel
    {
        [Required]
        [StringLength(16, MinimumLength = 4)]
        public string Name { get; set; }

        public bool IsCompleted { get; set; }
    }
}
