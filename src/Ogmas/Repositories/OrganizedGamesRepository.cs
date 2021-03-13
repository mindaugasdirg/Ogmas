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

        public async Task<IEnumerable<OrganizedGame>> GetGamesByOrganizer(Guid organizerId)
        {
            return await Filter(x => x.OrganizerId == organizerId);
        }

        public async Task<IEnumerable<OrganizedGame>> GetGamesByType(Guid gameTypeId)
        {
            return await Filter(x => x.GameTypeId == gameTypeId);
        }
    }
}