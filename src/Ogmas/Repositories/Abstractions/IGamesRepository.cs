using System.Collections.Generic;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories.Abstractions
{
    public interface IGamesRepository : IBaseEntityRepository<Game>
    {
        IEnumerable<Game> GetReadyGames();
    }
}