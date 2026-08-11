using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.User;

namespace Sahnem.Business.Interfaces
{
    public interface IUserService
    {
        Task<AuthResponseDto> LoginUser(AppUserLoginDto userLoginDto);
        Task<AppUserResponseDto> GetUserById(int id);
        Task<AppUserResponseDto> GetMe();
        Task<PagedResultDto<AppUserResponseDto>> GetAllUsers(int page = 1, int pageSize = 20);
        Task<AuthResponseDto> RegisterUser(AppUserRegisterDto userRegisterDto);
        Task UpdateUser(AppUserUpdateDto userUpdateDto);
        Task DeleteUser();

        Task<AuthResponseDto> RefreshToken(string refreshToken);
        Task Logout(string refreshToken);

        Task VerifyEmail(string code);
        Task ResendVerificationEmail();

    }
}
