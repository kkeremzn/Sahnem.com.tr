using Sahnem.Core.Entities;

namespace Sahnem.Business.Security
{
    // JwtService sadece access token imzalıyor (DB'ye dokunmuyor). Bu servis onun
    // üzerine refresh token üretimi/rotasyonu/iptalini ekliyor — UserService ve
    // ProfileService'teki tüm "token üret" noktaları artık buradan geçiyor,
    // böylece access+refresh token her zaman birlikte ve tutarlı üretiliyor.
    public interface ITokenService
    {
        Task<TokenPairDto> IssueTokensAsync(AppUser user);
        Task<TokenPairDto> RefreshAsync(string refreshToken);
        Task RevokeAsync(string refreshToken);
    }
}
