using System.ComponentModel.DataAnnotations;

namespace Ogmas.Models.Dtos
{
    public class CreateTaskAnswer
    {
        [Required]
        public string Answer { get; set; }
        
        [Required]
        public bool IsCorrect { get; set; }

        [Required]
        public string Location { get; set; }
    }
}