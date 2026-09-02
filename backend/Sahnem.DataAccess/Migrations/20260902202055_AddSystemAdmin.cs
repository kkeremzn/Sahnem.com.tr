using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Sahnem.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddSystemAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastLoginIp = table.Column<string>(type: "text", nullable: true),
                    PasswordResetCode = table.Column<string>(type: "text", nullable: true),
                    PasswordResetCodeExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PasswordResetCodeSentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AdminRefreshTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Token = table.Column<string>(type: "text", nullable: false),
                    AdminId = table.Column<int>(type: "integer", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminRefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdminRefreshTokens_Admins_AdminId",
                        column: x => x.AdminId,
                        principalTable: "Admins",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdminRefreshTokens_AdminId",
                table: "AdminRefreshTokens",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_AdminRefreshTokens_Token",
                table: "AdminRefreshTokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Admins_Email",
                table: "Admins",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Admins_Username",
                table: "Admins",
                column: "Username",
                unique: true);

            // İlk (bootstrap) admin hesabı — şifre hash'i önceden üretilip buraya
            // gömüldü, düz metin şifre hiçbir yerde saklanmıyor. Giriş yaptıktan
            // sonra "Şifre Değiştir" ile hemen değiştirilmesi öneriliyor.
            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Username", "Email", "PasswordHash", "CreatedDate", "IsActive" },
                values: new object[]
                {
                    "kkeremzn",
                    "kkeremzn+admin@gmail.com",
                    "AQAAAAEAACcQAAAAEPK/2z86Fc9uSXLWVQbuNZ7OMPZYI83n+U7UiZ3Vh1cN0mCPI7wu7TViKwa4WVaU6g==",
                    DateTime.UtcNow,
                    true,
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminRefreshTokens");

            migrationBuilder.DropTable(
                name: "Admins");
        }
    }
}
