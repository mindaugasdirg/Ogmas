using System;

namespace Ogmas.Models.Dtos.Get
{
    public class OrganizedGameResponse
    {
        public string Id { get; set; }
        public DateTime StartTime { get; set; }
        public double StartInterval { get; set; }
        public string GameTypeId { get; set; }
        public string OrganizerId { get; set; }
    }
}