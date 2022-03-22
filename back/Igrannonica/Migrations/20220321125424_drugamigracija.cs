using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Igrannonica.Migrations
{
    public partial class drugamigracija : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RandomFileName",
                table: "File",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RandomFileName",
                table: "File");
        }
    }
}
