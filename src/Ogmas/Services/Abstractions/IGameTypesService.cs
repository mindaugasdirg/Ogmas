using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Dtos;

namespace Ogmas.Services.Abstractions
{
    public interface IGameTypesService
    {
        Task<GameResponse> CreateGame(CreateGameConfiguration gameOptions);
        Task<IEnumerable<GameResponse>> GetGames();
        Task<GameResponse> GetGame(string id);
    }
}