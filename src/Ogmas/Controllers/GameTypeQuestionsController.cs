using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ogmas.Services.Abstractions;

namespace Ogmas.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/gametypes/{gameId}/questions")]
    public class GameTypeQuestionsController : ControllerBase
    {
        private readonly IGameTasksService gameTasksService;

        public GameTypeQuestionsController(IGameTasksService _gameTasksService)
        {
            gameTasksService = _gameTasksService;
        }

        [HttpGet]
        public IActionResult GetQuestions(string gameId)
        {
            return Ok(gameTasksService.GetQuestionsByGame(gameId));
        }
    }
}