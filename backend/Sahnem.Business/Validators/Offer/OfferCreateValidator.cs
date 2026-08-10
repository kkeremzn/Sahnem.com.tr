using FluentValidation;
using Sahnem.Business.DTOs.Offer;

namespace Sahnem.Business.Validators.Offer
{
    public class OfferCreateValidator : AbstractValidator<OfferCreateDto>
    {
        public OfferCreateValidator()
        {
            RuleFor(x => x.AdvertId)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0)
            .WithMessage("Please select a valid advert");

            RuleFor(x => x.Message)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Message can not be empty")
            .MinimumLength(10)
            .WithMessage("Message must be at least 10 characters long")
            .MaximumLength(500)
            .WithMessage("Message must not exceed 500 characters");

            RuleFor(x => x.ProposedPrice)
            .GreaterThan(0)
            .WithMessage("Proposed price must be greater than 0");
        }
    }
}
