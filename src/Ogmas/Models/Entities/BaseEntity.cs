using System;
using System.ComponentModel.DataAnnotations;

namespace Ogmas.Models.Entities
{
    public class BaseEntity
    {
        [Key]
        [Required]
        public Guid Id { get; set; }

        [Required]
        public bool IsDeleted { get; set; }
    }
}