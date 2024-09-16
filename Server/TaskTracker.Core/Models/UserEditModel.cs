using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Core.Models
{
    public class UserEditModel
    {
        [Required]
        [StringLength(16, MinimumLength = 4)]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(50, MinimumLength = 6)]
        public string Email { get; set; }
    }
}
