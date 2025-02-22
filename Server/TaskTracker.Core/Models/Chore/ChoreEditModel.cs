using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Core.Models.Chore
{
    public class ChoreEditModel
    {
        [Required]
        [StringLength(16, MinimumLength = 4)]
        public string Name { get; set; }

        [StringLength(16, MinimumLength = 4)]
        public string? OldName { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        public bool IsCompleted { get; set; }

        [Required]
        public string UserId { get; set; }
    }
}
