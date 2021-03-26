using System;

namespace Ogmas.Models.Dtos
{
    public class CreateGameOptions
    {
        public DateTime StartTime { get; set; }
        public TimeSpan StartInterval { get; set; }
        public string GameType { get; set; }
    }
}