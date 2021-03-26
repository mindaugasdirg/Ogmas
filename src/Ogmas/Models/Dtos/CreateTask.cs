using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ogmas.Models.Dtos
{
    public class CreateTask
    {
        [Required]
        public string Question { get; set; }
        public string Hint { get; set; }
        public IEnumerable<CreateTaskAnswer> Answers { get; set; }
    }
}