using System;

namespace Ogmas.Models.Dtos
{
    public class HostGameOptions
    {
        public DateTime StartTime { get; set; }
        public double StartInterval { get; set; }
        public string GameTypeId { get; set; }
    }
}