using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sahnem.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvertTargetBranchAndPricePrecision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TargetBranch",
                table: "Adverts",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetBranch",
                table: "Adverts");
        }
    }
}
