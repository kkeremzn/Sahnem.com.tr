using Sahnem.Business.DTOs.AdminAuth;

namespace Sahnem.Business.Interfaces
{
    public interface IAdminAuthService
    {
        Task<AdminTokenPairDto> Login(AdminLoginDto dto, string? ipAddress);
        Task<AdminTokenPairDto> RefreshToken(string refreshToken);
        Task Logout(string refreshToken);
        Task<AdminResponseDto> GetMe();

        Task ForgotPassword(AdminForgotPasswordDto dto);
        Task VerifyResetCode(AdminVerifyResetCodeDto dto);
        Task ResetPassword(AdminResetPasswordDto dto);
        Task ChangePassword(AdminChangePasswordDto dto);
    }
}
