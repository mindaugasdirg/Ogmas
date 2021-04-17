using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ogmas.Services.Abstractions;
using Ogmas.Utilities;

namespace Ogmas.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/games/{gameId}")]
    public class GameAnswersController : ControllerBase
    {
        private readonly IPlayersService playersService;

        public GameAnswersController(IPlayersService _playersService)
        {
            playersService = _playersService;
        }

        [HttpPost("questions/{questionId}/answers/{answerId}")]
        public async Task<IActionResult> SubmitAnswer(string gameId, string questionId, string answerId)
        {
            var user = HttpContext.User.GetSubClaim();
            var added = await playersService.SubmitAnswer(gameId, user, questionId, answerId);
            return Ok(added);
        }

        [HttpGet("players/{playerId}/answers")]
        public IActionResult GetPlayerAnswers(string gameId, string playerId)
        {
            var answers = playersService.GetPlayerAnswers(gameId, playerId);
            return Ok(answers);
        }
    }
}