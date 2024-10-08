using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace namasdev.Web.JS.Sample.ViewModels.UIForms
{
    public class UIFormsViewModel : IValidatableObject
    {
        [Required]
        public string Text { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Text == "error")
            {
                yield return new ValidationResult("Error", new[] { nameof(Text) });
            }
        }
    }
}