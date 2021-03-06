using System.Linq;
using System.Security.Claims;
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
    public class GamesController : ControllerBase
    {
        private readonly IGamesService gamesService;

        public GamesController(IGamesService _gamesService)
        {
            gamesService = _gamesService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGame([FromBody] HostGameOptions gameOptions)
        {
            var user = HttpContext.User.GetSubClaim();
            var created = await gamesService.CreateGame(user, gameOptions);
            return Created($"/api/games/{created.Id}", created);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(string id)
        {
            var game = await gamesService.DeleteGame(id);
            return Ok(game);
        }

        [HttpGet("{id}")]
        public IActionResult GetGame(string id)
        {
            var game = gamesService.GetGame(id);
            return Ok(game);
        }
    }
}