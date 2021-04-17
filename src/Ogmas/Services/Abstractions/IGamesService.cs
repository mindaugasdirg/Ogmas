using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Dtos.Create;
using Ogmas.Models.Dtos.Get;

namespace Ogmas.Services.Abstractions
{
    public interface IGamesService
    {
        Task<OrganizedGameResponse> CreateGame(string userId, HostGameOptions options);
        Task<OrganizedGameResponse> DeleteGame(string id);
        OrganizedGameResponse GetGame(string id);
        IEnumerable<OrganizedGameResponse> GetGames(string hostId);
    }
}