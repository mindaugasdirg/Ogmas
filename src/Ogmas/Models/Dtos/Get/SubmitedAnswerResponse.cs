namespace Ogmas.Models.Dtos.Get
{
    public class SubmitedAnswerResponse
    {
        public string Id { get; set; }
        public string GameId { get; set; }
        public string PlayerId { get; set; }
        public string PickedAnswerId { get; set; }
        public bool IsCorrect { get; set; }
    }
}