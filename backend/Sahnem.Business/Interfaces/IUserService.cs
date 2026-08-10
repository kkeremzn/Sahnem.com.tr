using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.User;

namespace Sahnem.Business.Interfaces
{
    public interface IUserService
    {
        Task<AuthResponseDto> LoginUser(AppUserLoginDto userLoginDto);
        Task<AppUserResponseDto> GetUserById(int id);
        Task<AppUserResponseDto> GetMe();
        Task<IEnumerable<AppUserResponseDto>> GetAllUsers();
        Task<AppUserResponseDto> RegisterUser(AppUserRegisterDto userRegisterDto);
        Task UpdateUser(AppUserUpdateDto userUpdateDto);
        Task DeleteUser();

    }
}