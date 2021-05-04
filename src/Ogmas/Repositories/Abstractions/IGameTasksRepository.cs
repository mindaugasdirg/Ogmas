using System.Collections.Generic;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories.Abstractions
{
    public interface IGameTasksRepository : IBaseEntityRepository<GameTask>
    {
        IEnumerable<GameTask> GetTasksByGame(string gameId);
    }
}