using Microsoft.EntityFrameworkCore;

namespace Voltorb_Flip_Web_App.Models
{
    public class VoltorbflipDBContext : DbContext
    {
        public VoltorbflipDBContext(DbContextOptions<VoltorbflipDBContext> options) : base(options)
        {
        }

        public DbSet<HighScoreboard> HighscoreTable { get; set; }
    }
}