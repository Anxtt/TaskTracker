using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Core.Models.Chore
{
    public class ChoreRequestModel
    {
        [Required]
        [StringLength(16, MinimumLength = 4)]
        public string Name { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        [Required]
        public string UserId { get; set; }
    }
}
