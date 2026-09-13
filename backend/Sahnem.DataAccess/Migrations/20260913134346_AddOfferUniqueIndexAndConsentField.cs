using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sahnem.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddOfferUniqueIndexAndConsentField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Offers_AdvertId",
                table: "Offers");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_AdvertId_MusicianId",
                table: "Offers",
                columns: new[] { "AdvertId", "MusicianId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Offers_AdvertId_MusicianId",
                table: "Offers");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_AdvertId",
                table: "Offers",
                column: "AdvertId");
        }
    }
}
