using System;

namespace Ogmas.Models.Dtos.Get
{
    public class PlayerResponse
    {
        public string Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? FinishTime { get; set; }
        public string GameId { get; set; }
        public string PlayerId { get; set; }
    }
}