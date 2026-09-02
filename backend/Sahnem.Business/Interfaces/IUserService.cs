using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.User;
using Sahnem.Business.Security;

namespace Sahnem.Business.Interfaces
{
    public interface IUserService
    {
        Task<TokenPairDto> LoginUser(AppUserLoginDto userLoginDto);
        Task<AppUserResponseDto> GetUserById(int id);
        Task<AppUserResponseDto> GetMe();
        Task<PagedResultDto<AppUserResponseDto>> GetAllUsers(int page = 1, int pageSize = 20);
        Task<TokenPairDto> RegisterUser(AppUserRegisterDto userRegisterDto);
        Task UpdateUser(AppUserUpdateDto userUpdateDto);
        Task ChangePassword(ChangePasswordDto dto);
        Task DeleteUser();

        Task<TokenPairDto> RefreshToken(string refreshToken);
        Task Logout(string refreshToken);

        Task VerifyEmail(string code);
        Task ResendVerificationEmail();

        Task ForgotPassword(ForgotPasswordDto dto);
        Task VerifyResetCode(VerifyResetCodeDto dto);
        Task ResetPassword(ResetPasswordDto dto);

    }
}
