using FluentValidation;
using Sahnem.Business.DTOs.User;

namespace Sahnem.Business.Validators.User
{
    public class ChangePasswordValidator : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordValidator()
        {
            RuleFor(x => x.CurrentPassword)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Current password is required");

            RuleFor(x => x.NewPassword)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("New password is required")
            .MinimumLength(6)
            .WithMessage("New password must be at least 6 characters long")
            .MaximumLength(100)
            .WithMessage("New password must not exceed 100 characters");
        }
    }
}
