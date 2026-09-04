using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sahnem.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddEquipmentNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EquipmentNote",
                table: "MusicianProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EquipmentNote",
                table: "Adverts",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EquipmentNote",
                table: "MusicianProfiles");

            migrationBuilder.DropColumn(
                name: "EquipmentNote",
                table: "Adverts");
        }
    }
}
