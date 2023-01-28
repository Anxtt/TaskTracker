using Microsoft.AspNetCore.Identity;

namespace TaskTracker.Data.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<Chore> Chores { get; } = new List<Chore>();
    }
}