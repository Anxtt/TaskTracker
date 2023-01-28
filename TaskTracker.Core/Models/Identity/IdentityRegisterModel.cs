using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Core.Models.Identity
{
    public class IdentityRegisterModel : IdentityLoginModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; }
    }
}
