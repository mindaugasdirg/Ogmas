using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories
{
    public class GameTasksRepository : BaseEntityRepository<GameTask>
    {
        public GameTasksRepository(DatabaseContext context) : base(context)
        {
        }

        protected override IQueryable<GameTask> Query() => Context.GameTasks.Include(x => x.Game);

        public IEnumerable<GameTask> GetTasksByGame(string gameId)
        {
            return Filter(x => x.GameId == gameId);
        }
    }
}