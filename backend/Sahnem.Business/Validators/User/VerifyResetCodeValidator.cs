using FluentValidation;
using Sahnem.Business.DTOs.User;

namespace Sahnem.Business.Validators.User
{
    public class VerifyResetCodeValidator : AbstractValidator<VerifyResetCodeDto>
    {
        public VerifyResetCodeValidator()
        {
            RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Email is required")
            .EmailAddress()
            .WithMessage("Invalid email format");

            RuleFor(x => x.Code)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Code is required")
            .Matches(@"^\d{6}$")
            .WithMessage("Code must be a 6-digit number");
        }
    }
}
