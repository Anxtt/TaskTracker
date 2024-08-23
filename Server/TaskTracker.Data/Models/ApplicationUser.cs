using Microsoft.AspNetCore.Identity;

namespace TaskTracker.Data.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<Chore> Chores { get; } = new List<Chore>();

        public string? RefreshToken { get; set; }

        public DateTime Created { get; set; }
        
        public DateTime Expires { get; set; }

        public bool IsExpired => DateTime.Now >= this.Expires;

        public bool IsActive => this.IsExpired is false;
    }
}