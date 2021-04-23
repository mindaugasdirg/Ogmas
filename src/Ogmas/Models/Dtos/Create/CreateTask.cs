using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ogmas.Models.Dtos.Create
{
    public class CreateTask
    {
        [Required]
        public string Question { get; set; }
        public string Hint { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double Radius { get; set; }
        public IEnumerable<CreateTaskAnswer> Answers { get; set; }
    }
}