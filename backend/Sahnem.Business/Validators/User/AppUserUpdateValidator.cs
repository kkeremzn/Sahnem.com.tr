using FluentValidation;
using Sahnem.Business.DTOs.User;

namespace Sahnem.Business.Validators.User
{
    public class AppUserUpdateValidator : AbstractValidator<AppUserUpdateDto>
    {
        public AppUserUpdateValidator()
        {
            RuleFor(x => x.FirstName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .Must(x=> !string.IsNullOrWhiteSpace(x))
            .WithMessage("First name can not be empty and whitespace")
            .MinimumLength(2)
            .WithMessage("First name must be at least 2 characters long")
            .MaximumLength(50)
            .WithMessage("First name must not exceed 50 characters");

            RuleFor(x=> x.LastName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .Must(x=> !string.IsNullOrWhiteSpace(x))
            .WithMessage("Last name can not be empty and whitespace")
            .MinimumLength(2)
            .WithMessage("Last name must be at least 2 characters long")
            .MaximumLength(50)
            .WithMessage("Last name must not exceed 50 characters");


            RuleFor(x => x.PhoneNumber)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Phone number is required")
                .Matches(@"^0?5\d{9}$")
                .WithMessage("Invalid phone number format");
            
        }
    }
}