using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ogmas.Models.Entities
{
    public class GameParticipant : BaseEntity
    {
        public DateTime StartTime { get; set; }
        public DateTime FinishTime { get; set; }

        [ForeignKey("GameId")]
        public OrganizedGame Game { get; set; }
        public Guid GameId { get; set; }

        [ForeignKey("PlayerId")]
        public User Player { get; set; }
        public Guid PlayerId { get; set; }
    }
}