using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ogmas.Services.Abstractions;

namespace Ogmas.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/games/{gameId}/players")]
    public class GamePlayersController : ControllerBase
    {
        private readonly IPlayersService playersService;

        public GamePlayersController(IPlayersService _playersService)
        {
            playersService = _playersService;
        }

        [HttpPost]
        public async Task<IActionResult> JoinGame(string gameId)
        {
            var user = HttpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var player = await playersService.JoinGame(gameId, user);
            return Created($"{player.Id}", player);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> LeaveGame(string gameId, string id)
        {
            var player = await playersService.LeaveGame(id);
            return NoContent();
        }

        [HttpGet]
        public IActionResult GetPlayers(string gameId)
        {
            var players = playersService.GetPlayers(gameId);
            return Ok(players);
        }
    }
}