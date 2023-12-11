using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using TaskTracker.Data.Models;

namespace TaskTracker.Data
{
    public class TaskTrackerDbContext : IdentityDbContext<ApplicationUser>
    {
        public TaskTrackerDbContext(DbContextOptions<TaskTrackerDbContext> options)
            : base(options)
        {

        }

        public DbSet<Chore> Chores { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
