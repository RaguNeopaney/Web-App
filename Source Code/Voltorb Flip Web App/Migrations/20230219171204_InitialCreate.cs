using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Voltorb_Flip_Web_App.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HighScoretbl",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    HighScore = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HighScoretbl", x => x.ID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HighScoretbl");
        }
    }
}
