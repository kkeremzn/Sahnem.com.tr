using FluentValidation;
using Sahnem.Business.DTOs.Advert;
using Sahnem.Core.Enums;

namespace Sahnem.Business.Validators.Advert
{
    public class AdvertUpdateValidator : AbstractValidator<AdvertUpdateDto>
    {
        public AdvertUpdateValidator()
        {
            RuleFor(x=> x.Title)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Title can not be empty")
            .MinimumLength(20)
            .WithMessage("Title must be at least 20 characters long")
            .MaximumLength(100)
            .WithMessage("Title must not exceed 100 characters");


            RuleFor(x=> x.Description)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Description can not be empty")
            .MinimumLength(30)
            .WithMessage("Description must be at least 30 characters long")
            .MaximumLength(100)
            .WithMessage("Description must not exceed 100 characters");

            RuleFor(x=> x.City)
            .Cascade(CascadeMode.Stop)
            .NotEqual(City.None)
            .WithMessage("Please select a City")
            .IsInEnum()
            .WithMessage("Invalid City");


            RuleFor(x=> x.District)
            .Cascade(CascadeMode.Stop)
            .MinimumLength(1)
            .WithMessage("Districtmust be at least 1 characters long")
            .MaximumLength(17)
            .WithMessage("District must not exceed 17 characters");


            RuleFor(x=> x.Address)
            .NotEmpty()
            .WithMessage("Address can not be empty");

            RuleFor(x=> x.EventTime)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Event time must be in the future")
            .GreaterThan(DateTime.UtcNow.AddDays(1))
            .WithMessage("Event time must be at least 1 day later");


            RuleFor(x=> x.Budget)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Budget can not be empty");


            RuleFor(x=> x.MinimumExperienceYears)
            .InclusiveBetween(0,50)
            .WithMessage("Minimum Experience years must be between 0 and 50");

            RuleFor(x=> x.ApplicationDeadline)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Application Deadline can not be empty")
            .LessThan(x=> x.EventTime)
            .WithMessage("Application deadline must be before the event")
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Application Deadline must be in the future");
        }
    }
}