namespace Sahnem.Business.DTOs.AdminAuth
{
    public class AdminTokenPairDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime RefreshTokenExpiresAt { get; set; }
    }

    public class AdminResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime? LastLoginAt { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class AdminForgotPasswordDto
    {
        public string Username { get; set; } = string.Empty;
    }

    public class AdminVerifyResetCodeDto
    {
        public string Username { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }

    public class AdminResetPasswordDto
    {
        public string Username { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class AdminChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
