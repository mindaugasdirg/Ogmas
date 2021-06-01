using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ogmas.Models.Dtos.Create;
using Ogmas.Services.Abstractions;
using Ogmas.Utilities;

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
            var user = User.GetSubClaim();
            var created = await gameTypeService.CreateGame(gameDto, user);
            return Created($"/api/gametype/{created.Id}", created);
        }

        [HttpGet]
        public IActionResult GetGames()
        {
            var user = User.GetSubClaim();
            var games = gameTypeService.GetGames(user);
            return Ok(games);
        }
        
        [HttpGet("{id}")]
        public IActionResult GetGame(string id)
        {
            var user = User.GetSubClaim();
            var game = gameTypeService.GetGame(id, user);
            return Ok(game);
        }
    }
}