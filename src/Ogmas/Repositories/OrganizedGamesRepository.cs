using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ogmas.Models.Entities;
using Ogmas.Repositories.Abstractions;

namespace Ogmas.Repositories
{
    public class OrganizedGamesRepository : BaseEntityRepository<OrganizedGame>, IOrganizedGamesRepository
    {
        public OrganizedGamesRepository(DatabaseContext context) : base(context)
        {
        }

        protected override IQueryable<OrganizedGame> Query() => Context.OrganizedGames.Include(x => x.GameType);

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