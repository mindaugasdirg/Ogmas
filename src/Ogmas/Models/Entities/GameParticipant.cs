using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ogmas.Models.Entities
{
    public class GameParticipant : BaseEntity
    {
        public DateTime StartTime { get; set; }
        public DateTime? FinishTime { get; set; }

        [ForeignKey("GameId")]
        public OrganizedGame Game { get; set; }
        public string GameId { get; set; }

        [ForeignKey("PlayerId")]
        public User Player { get; set; }
        public string PlayerId { get; set; }
    }
}