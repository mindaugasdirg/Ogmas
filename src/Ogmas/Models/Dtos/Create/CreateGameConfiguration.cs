using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ogmas.Models.Dtos.Create
{
    public class CreateGameConfiguration
    {
        [Required]
        public string Name { get; set; }
        public IEnumerable<CreateTask> Tasks { get; set; }
    }
}