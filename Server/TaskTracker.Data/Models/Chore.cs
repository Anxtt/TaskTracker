using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskTracker.Data.Models
{
    public class Chore
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(16, MinimumLength = 4)]
        public string Name { get; set; }

        [Required]
        public DateTime CreatedOn { get; set; } = DateTime.Now;

        [Required]
        public DateTime Deadline { get; set; }

        public bool IsCompleted { get; set; } = false;

        [ForeignKey(nameof(User))]
        [Required]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
