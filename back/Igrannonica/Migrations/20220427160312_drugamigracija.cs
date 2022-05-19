using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Igrannonica.Migrations
{
    public partial class drugamigracija : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "verifiedMail",
                table: "User",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "verifyNumber",
                table: "User",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "verifiedMail",
                table: "User");

            migrationBuilder.DropColumn(
                name: "verifyNumber",
                table: "User");
        }
    }
}
