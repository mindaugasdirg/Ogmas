namespace Ogmas.Models.Dtos.Get
{
    public class GameTaskResponse
    {
        public string Id { get; set; }
        public string Question { get; set; }
        public string Hint { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double Radius { get; set; }
    }
}