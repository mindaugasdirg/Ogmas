using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ogmas.Models.Dtos.Create;
using Ogmas.Services.Abstractions;

namespace Ogmas.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GameTypesController : ControllerBase
    {
        private readonly IGameTypesService gameTypeService;

        public GameTypesController(IGameTypesService _gameTypeService)
        {
            gameTypeService = _gameTypeService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameConfiguration gameDto)
        {
            var created = await gameTypeService.CreateGame(gameDto);
            return Created($"/api/gametype/{created.Id}", created);
        }

        [HttpGet]
        public IActionResult GetGames()
        {
            var games = gameTypeService.GetGames();
            return Ok(games);
        }
        
        [HttpGet("{id}")]
        public IActionResult GetGame(string id)
        {
            var game = gameTypeService.GetGame(id);
            return Ok(game);
        }
    }
}