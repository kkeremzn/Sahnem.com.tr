using System.Data;
using FluentValidation;
using Sahnem.Business.DTOs;
using Sahnem.Business.Enums;
using Sahnem.Core.Enums;

namespace Sahnem.Business.Validators.Profile
{
    public class MusicianProfileCreateValidator : AbstractValidator<MusicianProfileCreateDto>
    {
        public MusicianProfileCreateValidator()
        {
            RuleFor(x => x.Bio)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Bio can not be empty")
            .MinimumLength(20)
            .WithMessage("Bio must be at least 20 characters long")
            .MaximumLength(100)
            .WithMessage("Bio must not exceed 100 characters");



            RuleFor(x => x.Branch)
            .Cascade(CascadeMode.Stop)
            .NotEqual(MusicBranch.None)
            .WithMessage("Please select a branch")
            .IsInEnum()
            .WithMessage("Invalid branch");


            RuleFor(x => x.Genres)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Genres can not be empty")
            .MinimumLength(2)
            .WithMessage("Genres must be at least 2 characters long")
            .MaximumLength(50)
            .WithMessage("Genres must not exceed 50 characters");


            RuleFor(x => x.ExperienceYears)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Experience Year can not be empty")
            .InclusiveBetween(0,50)
            .WithMessage("Experience years must be between 0 and 50");

            
            RuleFor(x => x.City)
            .Cascade(CascadeMode.Stop)
            .NotEqual(City.None)
            .WithMessage("Please select a City")
            .IsInEnum()
            .WithMessage("Invalid City");


            RuleFor(x => x.District)
            .Cascade(CascadeMode.Stop)
            .MinimumLength(1)
            .WithMessage("Districtmust be at least 1 characters long")
            .MaximumLength(17)
            .WithMessage("District must not exceed 17 characters");


            RuleFor(x => x.IsAvailableToTravel)
            .Cascade(CascadeMode.Stop)
            .NotEqual(IsAvailableToTravel.None)
            .WithMessage("Please select a choice")
            .IsInEnum()
            .WithMessage("Invalid choice");


            RuleFor(x => x.WorkStatus)
            .Cascade(CascadeMode.Stop)
            .NotEqual(WorkStatus.None)
            .WithMessage("Please select a WorkStatus")
            .IsInEnum()
            .WithMessage("Invalid WorkStatus");

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