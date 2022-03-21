using Microsoft.EntityFrameworkCore;

namespace Igrannonica.Models
{
    public class MySqlContext : DbContext
    {
        public MySqlContext(DbContextOptions<MySqlContext> options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<File>()
            .HasOne(p => p.User)
            .WithMany(b => b.Files)
            .HasForeignKey(p => p.UserForeignKey);

            builder.Entity<User>(entity => {
                entity.HasIndex(e => e.username).IsUnique();
                entity.HasIndex(e => e.email).IsUnique();
            });
        }

        public DbSet<User> User { get; set; }
        public DbSet<File> File { get; set; }
    }
}
