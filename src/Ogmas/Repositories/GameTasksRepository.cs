using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories
{
    public class GameTasksRepository : BaseEntityRepository<GameTask>
    {
        public GameTasksRepository(DatabaseContext context) : base(context)
        {
        }

        public IEnumerable<GameTask> GetTasksByGame(string gameId)
        {
            return Filter(x => x.GameId == gameId);
        }
    }
}