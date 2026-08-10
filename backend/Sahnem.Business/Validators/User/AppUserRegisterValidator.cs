using FluentValidation;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.User;

namespace Sahnem.Business.Validators.User
{
    public class AppUserRegisterValidator : AbstractValidator<AppUserRegisterDto>
    {
        public AppUserRegisterValidator()
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

            RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Password is required")
            .MinimumLength(6)
            .WithMessage("Password must be at least 6 characters long")
            .MaximumLength(100)
            .WithMessage("Password must not exceed 100 characters");

            RuleFor(x => x.PhoneNumber)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Phone number is required")
                .Matches(@"^05\d{9}$")
                .WithMessage("Invalid phone number format");

            
        }
    }
}