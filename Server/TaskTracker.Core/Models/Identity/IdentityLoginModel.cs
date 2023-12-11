using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Core.Models.Identity
{
    public class IdentityLoginModel
    {
        [Required]
        [StringLength(16, MinimumLength = 4)]
        public string UserName { get; set; }

        [Required]
        [StringLength(18, MinimumLength = 6)]
        public string Password { get; set; }
    }
}
