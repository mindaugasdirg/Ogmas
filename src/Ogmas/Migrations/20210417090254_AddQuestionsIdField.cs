using Microsoft.EntityFrameworkCore.Migrations;

namespace Ogmas.Migrations
{
    public partial class AddQuestionsIdField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QuestionId",
                table: "SubmitedAnswers",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SubmitedAnswers_QuestionId",
                table: "SubmitedAnswers",
                column: "QuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_SubmitedAnswers_GameTasks_QuestionId",
                table: "SubmitedAnswers",
                column: "QuestionId",
                principalTable: "GameTasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubmitedAnswers_GameTasks_QuestionId",
                table: "SubmitedAnswers");

            migrationBuilder.DropIndex(
                name: "IX_SubmitedAnswers_QuestionId",
                table: "SubmitedAnswers");

            migrationBuilder.DropColumn(
                name: "QuestionId",
                table: "SubmitedAnswers");
        }
    }
}
