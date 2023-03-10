// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Voltorb_Flip_Web_App.Models;

#nullable disable

namespace Voltorb_Flip_Web_App.Migrations
{
    [DbContext(typeof(VoltorbflipDBContext))]
    partial class VoltorbflipDBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.14")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("Voltorb_Flip_Web_App.Models.HighScoreboard", b =>
                {
                    b.Property<int>("ID")
                        .HasColumnType("int");

                    b.Property<long>("HighScore")
                        .HasColumnType("bigint")
                        .HasColumnName("HighScore");

                    b.HasKey("ID");

                    b.ToTable("HighScoretbl");
                });
#pragma warning restore 612, 618
        }
    }
}
