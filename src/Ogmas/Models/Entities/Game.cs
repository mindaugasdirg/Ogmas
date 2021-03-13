using System.ComponentModel.DataAnnotations;

namespace Ogmas.Models.Entities
{
    public class Game : BaseEntity
    {
        [Required]
        public string Name { get; set; }
    }
}