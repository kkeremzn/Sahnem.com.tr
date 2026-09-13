using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sahnem.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddSecurityStampAndAttemptTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EmailVerificationAttempts",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PasswordResetAttempts",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SecurityStamp",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PasswordResetAttempts",
                table: "Admins",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SecurityStamp",
                table: "Admins",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailVerificationAttempts",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswordResetAttempts",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SecurityStamp",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswordResetAttempts",
                table: "Admins");

            migrationBuilder.DropColumn(
                name: "SecurityStamp",
                table: "Admins");
        }
    }
}
