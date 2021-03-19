using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ogmas.Models.Entities
{
    public class SubmitedAnswer : BaseEntity
    {
        [ForeignKey("GameId")]
        public OrganizedGame Game { get; set; }
        public string GameId { get; set; }

        [ForeignKey("PlayerId")]
        public GameParticipant Player { get; set; }
        public string PlayerId { get; set; }

        [ForeignKey("PickedAnswerId")]
        public TaskAnswer PickedAnswer { get; set; }
        public string PickedAnswerId { get; set; }
    }
}