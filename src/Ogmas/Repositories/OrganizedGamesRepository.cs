using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories
{
    public class OrganizedGamesRepository : BaseEntityRepository<OrganizedGame>
    {
        public OrganizedGamesRepository(DatabaseContext context) : base(context)
        {
        }

        public IEnumerable<OrganizedGame> GetGamesByOrganizer(string organizerId)
        {
            return Filter(x => x.OrganizerId == organizerId);
        }

        public IEnumerable<OrganizedGame> GetGamesByType(string gameTypeId)
        {
            return Filter(x => x.GameTypeId == gameTypeId);
        }
    }
}