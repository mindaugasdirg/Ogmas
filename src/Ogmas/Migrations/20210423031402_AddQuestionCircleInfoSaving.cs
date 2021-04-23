using Microsoft.EntityFrameworkCore.Migrations;

namespace Ogmas.Migrations
{
    public partial class AddQuestionCircleInfoSaving : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Radius",
                table: "GameTasks",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "X",
                table: "GameTasks",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Y",
                table: "GameTasks",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Radius",
                table: "GameTasks");

            migrationBuilder.DropColumn(
                name: "X",
                table: "GameTasks");

            migrationBuilder.DropColumn(
                name: "Y",
                table: "GameTasks");
        }
    }
}
