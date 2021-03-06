using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ogmas.Models.Entities
{
    public class GameTask : BaseEntity
    {
        [Required]
        public string Question { get; set; }
        public string Hint { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double Radius { get; set; }

        [ForeignKey("GameId")]
        [Required]
        public Game Game { get; set; }
        public string GameId { get; set; }
    }
}