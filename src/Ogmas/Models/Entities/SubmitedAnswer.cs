using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ogmas.Models.Entities
{
    public class SubmitedAnswer : BaseEntity
    {
        [ForeignKey("PlayerId")]
        public GameParticipant Player { get; set; }
        public Guid PlayerId { get; set; }

        [ForeignKey("PickedAnswerId")]
        public TaskAnswer PickedAnswer { get; set; }
        public Guid PickedAnswerId { get; set; }
    }
}