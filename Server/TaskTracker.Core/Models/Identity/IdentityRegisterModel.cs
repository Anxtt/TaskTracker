using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Core.Models.Identity
{
    public class IdentityRegisterModel : IdentityLoginModel
    {
        [Required]
        [EmailAddress]
        [StringLength(50, MinimumLength = 6)]
        public string Email { get; set; }

        [Required]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; }
    }
}
