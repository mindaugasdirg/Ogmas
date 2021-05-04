using System.Collections.Generic;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories.Abstractions
{
    public interface IOrganizedGamesRepository : IBaseEntityRepository<OrganizedGame>
    {
        IEnumerable<OrganizedGame> GetGamesByOrganizer(string organizerId);

        IEnumerable<OrganizedGame> GetGamesByType(string gameTypeId);
    }
}