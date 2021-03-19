using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ogmas.Models.Entities
{
    public class OrganizedGame : BaseEntity
    {
        public DateTime StartTime { get; set; }
        public TimeSpan StartInterval { get; set; }

        [ForeignKey("GameTypeId")]
        public Game GameType { get; set; }
        public string GameTypeId { get; set; }

        [ForeignKey("OrganizerId")]
        public User Organizer { get; set; }
        public string OrganizerId { get; set; }
    }
}