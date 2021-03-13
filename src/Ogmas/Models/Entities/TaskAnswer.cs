using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ogmas.Models.Entities
{
    public class TaskAnswer : BaseEntity
    {
        [Required]
        public string Answer { get; set; }
        [Required]
        public bool IsCorrect { get; set; }
        public string Location { get; set; }

        [ForeignKey("GameTaskId")]
        public GameTask GameTask { get; set; }
        public Guid GameTaskId { get; set; }
    }
}