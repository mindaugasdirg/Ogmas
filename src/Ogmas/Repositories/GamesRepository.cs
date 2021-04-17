using System.Collections.Generic;
using System.Linq;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories
{
    public class GamesRepository : BaseEntityRepository<Game>
    {
        public GamesRepository(DatabaseContext context) : base(context)
        {
        }

        protected override IQueryable<Game> Query() => Context.Games;

        public IEnumerable<Game> SearchGamesByName(string name)
        {
            return Filter(x => x.Name.Contains(name) && x.Ready);
        }

        public IEnumerable<Game> GetReadyGames()
        {
            return Filter(x => x.Ready);
        }
    }
}