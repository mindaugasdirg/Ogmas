using System.Collections.Generic;
using System.Linq;
using Ogmas.Models.Entities;
using Ogmas.Repositories.Abstractions;

namespace Ogmas.Repositories
{
    public class GamesRepository : BaseEntityRepository<Game>, IGamesRepository
    {
        public GamesRepository(DatabaseContext context) : base(context)
        {
        }

        protected override IQueryable<Game> Query() => Context.Games;

        public IEnumerable<Game> GetReadyGames()
        {
            return Filter(x => x.Ready);
        }
    }
}