using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sahnem.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddMultiSelectAndSpotify : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SpotifyUrl",
                table: "VenueProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AdditionalCities",
                table: "OrganizerProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SpotifyUrl",
                table: "OrganizerProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AdditionalCities",
                table: "MusicianProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SpotifyUrl",
                table: "MusicianProfiles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SpotifyUrl",
                table: "VenueProfiles");

            migrationBuilder.DropColumn(
                name: "AdditionalCities",
                table: "OrganizerProfiles");

            migrationBuilder.DropColumn(
                name: "SpotifyUrl",
                table: "OrganizerProfiles");

            migrationBuilder.DropColumn(
                name: "AdditionalCities",
                table: "MusicianProfiles");

            migrationBuilder.DropColumn(
                name: "SpotifyUrl",
                table: "MusicianProfiles");
        }
    }
}
