using System.Collections.Generic;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories.Abstractions
{
    public interface ISubmitedAnswersRepository : IBaseEntityRepository<SubmitedAnswer>
    {
        IEnumerable<SubmitedAnswer> GetAnswersByPlayer(string playerId);

        IEnumerable<SubmitedAnswer> GetAnswersByGame(string gameId);
    }
}