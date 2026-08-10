using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Sahnem.Business.DTOs;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;

namespace Sahnem.Business.Security
{
    public class JwtService : IJwtService
    {
        private readonly JwtSettings _jwtSettings;
        public JwtService(IOptions<JwtSettings> options)
        {
            _jwtSettings = options.Value;
        }

        public AuthResponseDto GenerateToken(AppUser appUser)
        {
            var key = Encoding.UTF8.GetBytes(_jwtSettings.Key);
            var securityKey = new SymmetricSecurityKey(key);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);


            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, appUser.Id.ToString()),
                new Claim(ClaimTypes.Email, appUser.Email),
                new Claim("IsProfileCompleted", appUser.IsProfileCompleted.ToString())
            };

            if (appUser.Role != UserType.None)
            {
                claims.Add(new Claim(ClaimTypes.Role, appUser.Role.ToString()));
            }

            var expiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpireMinutes);
            var token = new JwtSecurityToken(
                issuer : _jwtSettings.Issuer,
                audience : _jwtSettings.Audience,
                claims : claims,
                expires : expiration,
                signingCredentials : credentials
            );

            var handler = new JwtSecurityTokenHandler();
            return new AuthResponseDto
            {
                AccessToken = handler.WriteToken(token),
                ExpiresAt = expiration
            };
            
        }
    }
}