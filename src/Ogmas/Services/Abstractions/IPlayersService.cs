using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Dtos.Get;

namespace Ogmas.Services.Abstractions
{
    public interface IPlayersService
    {
        Task<PlayerResponse> JoinGame(string gameId, string userId);
        Task<PlayerResponse> LeaveGame(string playerId);
        IEnumerable<PlayerResponse> GetPlayers(string gameId);
    }
}