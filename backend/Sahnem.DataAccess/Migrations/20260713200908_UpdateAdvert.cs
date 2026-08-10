using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sahnem.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdvert : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "organizerType",
                table: "OrganizerProfiles",
                newName: "OrganizerType");

            migrationBuilder.RenameColumn(
                name: "IsOpen",
                table: "Adverts",
                newName: "EquipmentProvided");

            migrationBuilder.AlterColumn<int>(
                name: "Capacity",
                table: "VenueProfiles",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "OrganizerProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApplicationDeadline",
                table: "Adverts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "City",
                table: "Adverts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "Adverts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinimumExperienceYears",
                table: "Adverts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Adverts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "District",
                table: "OrganizerProfiles");

            migrationBuilder.DropColumn(
                name: "ApplicationDeadline",
                table: "Adverts");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Adverts");

            migrationBuilder.DropColumn(
                name: "District",
                table: "Adverts");

            migrationBuilder.DropColumn(
                name: "MinimumExperienceYears",
                table: "Adverts");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Adverts");

            migrationBuilder.RenameColumn(
                name: "OrganizerType",
                table: "OrganizerProfiles",
                newName: "organizerType");

            migrationBuilder.RenameColumn(
                name: "EquipmentProvided",
                table: "Adverts",
                newName: "IsOpen");

            migrationBuilder.AlterColumn<string>(
                name: "Capacity",
                table: "VenueProfiles",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
