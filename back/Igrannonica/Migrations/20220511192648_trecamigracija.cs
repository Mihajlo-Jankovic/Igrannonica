using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Igrannonica.Migrations
{
    public partial class trecamigracija : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "tempPassword",
                table: "User",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "tempPassword",
                table: "User");
        }
    }
}
