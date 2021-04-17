using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ogmas.Services.Abstractions;

namespace Ogmas.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly IGameTasksService gameTasksService;

        public QuestionsController(IGameTasksService _gameTasksService)
        {
            gameTasksService = _gameTasksService;
        }
        
        [HttpGet("{id}")]
        public IActionResult GetQuestion(string id)
        {
            var task = gameTasksService.GetQuestion(id);
            return Ok(task);
        }
    }
}