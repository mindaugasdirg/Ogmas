using System.ComponentModel.DataAnnotations;

namespace Ogmas.Models.Entities
{
    public class TaskAnswer : BaseEntity
    {
        [Required]
        public string Answer { get; set; }
        [Required]
        public bool IsCorrect { get; set; }
        public string Location { get; set; }
    }
}