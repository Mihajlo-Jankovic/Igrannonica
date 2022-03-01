using Microsoft.EntityFrameworkCore;

namespace WebApplication4.Models
{
    public class ProfileContext : DbContext
    {
        public ProfileContext(DbContextOptions<ProfileContext> options) : base(options)
        { }

        public DbSet<Profile> Profile { get; set; }
    }
}
