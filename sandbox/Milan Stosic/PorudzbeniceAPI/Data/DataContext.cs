using Microsoft.EntityFrameworkCore;

namespace PorudzbeniceAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        public DbSet<Dostava> Dostave { get; set; }
    }
}
