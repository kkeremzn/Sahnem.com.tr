using FluentValidation;
using Sahnem.Business.DTOs;

namespace Sahnem.Business.Validators.Profile
{
    public class OrganizerProfileCreateValidator : AbstractValidator<OrganizerProfileCreateDto>
    {
        public OrganizerProfileCreateValidator()
        {
            RuleFor(x => x.OrganizerName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .Must(x=> !string.IsNullOrWhiteSpace(x))
            .WithMessage("Organizer name can not be empty and whitespace")
            .MinimumLength(2)
            .WithMessage("Organizer name must be at least 2 characters long")
            .MaximumLength(50)
            .WithMessage("Organizer name must not exceed 50 characters");


            RuleFor(x=> x.Bio)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .Must(x=> !string.IsNullOrWhiteSpace(x))
            .WithMessage("Bio can not be empty and whitespace")
            .MinimumLength(30)
            .WithMessage("Bio must be at least 30 characters long")
            .MaximumLength(300)
            .WithMessage("Bio must not exceed 300 characters");


            RuleFor(x=> x.organizerType)
            .IsInEnum()
            .WithMessage("Invalid Organizer Type");

            RuleFor(x=> x.City)
            .IsInEnum()
            .WithMessage("Invalid City");

            RuleFor(x=> x.District)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("District can not be empty")
            .MinimumLength(1)
            .WithMessage("District must be at least 1 characters long")
            .MaximumLength(17)
            .WithMessage("District must not exceed 17 characters");


            RuleFor(x=> x.Address)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Adsress can not be empty")
            .MinimumLength(15)
            .WithMessage("Address be at least 15 characters long")
            .MaximumLength(50)
            .WithMessage("District must not exceed 50 characters");
            

            RuleFor(x => x.InstagramUrl)
            .Must(url => string.IsNullOrWhiteSpace(url) || url.Contains("instagram.com"))
            .WithMessage("Please enter a valid Instagram profile URL.");

            RuleFor(x => x.YoutubeUrl)
            .Must(url =>
            string.IsNullOrWhiteSpace(url) || url.Contains("youtube.com"))
            .WithMessage("Please enter a valid YouTube URL.");


            RuleFor(x => x.LinkedinUrl)
            .Must(url =>
            string.IsNullOrWhiteSpace(url) || url.Contains("linkedin.com"))
            .WithMessage("Please enter a valid LinkedIn profile URL.");


        }
    }
}