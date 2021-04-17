using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Dtos.Create;
using Ogmas.Models.Dtos.Get;

namespace Ogmas.Services.Abstractions
{
    public interface IGameTypesService
    {
        Task<GameResponse> CreateGame(CreateGameConfiguration gameOptions);
        IEnumerable<GameResponse> GetGames();
        GameResponse GetGame(string id);
    }
}