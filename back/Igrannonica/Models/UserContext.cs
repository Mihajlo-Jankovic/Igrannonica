using Microsoft.EntityFrameworkCore;

namespace Igrannonica.Models
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>(entity => {
                entity.HasIndex(e => e.username).IsUnique();
            });
            builder.Entity<User>(entity => {
                entity.HasIndex(e => e.email).IsUnique();
            });
        }

        public DbSet<User> User { get; set; }
    }
}
