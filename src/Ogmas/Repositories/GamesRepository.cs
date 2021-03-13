using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories
{
    public class GamesRepository : BaseEntityRepository<Game>
    {
        public GamesRepository(DatabaseContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Game>> SearchGamesByName(string name)
        {
            return await Filter(x => x.Name.Contains(name) && x.Ready);
        }

        public async Task<IEnumerable<Game>> GetReadyGames()
        {
            return await Filter(x => x.Ready);
        }
    }
}