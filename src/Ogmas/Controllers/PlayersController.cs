using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ogmas.Services.Abstractions;

namespace Ogmas.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly IPlayersService playersService;

        public PlayersController(IPlayersService _playersService)
        {
            playersService = _playersService;
        }

        [HttpGet("{id}")]
        public IActionResult GetPlayer(string id)
        {
            var player = playersService.GetPlayer(id);
            return Ok(player);
        }

        [HttpGet("{id}/username")]
        public IActionResult GetUsername(string id)
        {
            var username = playersService.GetUsername(id);
            return Ok(username);
        }
    }
}