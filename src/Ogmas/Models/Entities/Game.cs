using System.ComponentModel.DataAnnotations;

namespace Ogmas.Models.Entities
{
    public class Game : BaseEntity
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public bool Ready { get; set; }

        [Required]
        public string CreatedBy { get; set; }
    }
}