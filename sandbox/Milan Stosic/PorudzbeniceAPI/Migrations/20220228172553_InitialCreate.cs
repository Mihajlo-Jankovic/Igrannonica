using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PorudzbeniceAPI.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Dostave",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    ZipKod = table.Column<string>(type: "nvarchar(5)", nullable: false),
                    Grad = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Telefon = table.Column<string>(type: "nvarchar(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dostave", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dostave");
        }
    }
}
