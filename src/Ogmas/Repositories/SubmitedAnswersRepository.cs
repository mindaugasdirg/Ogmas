using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories
{
    public class SubmitedAnswersRepository : BaseEntityRepository<SubmitedAnswer>
    {
        public SubmitedAnswersRepository(DatabaseContext context) : base(context)
        {
        }

        public IEnumerable<SubmitedAnswer> GetAnswersByPlayer(string playerId)
        {
            return Filter(x => x.PlayerId == playerId);
        }

        public IEnumerable<SubmitedAnswer> GetAnswersByGame(string gameId)
        {
            return Filter(x => x.GameId == gameId);
        }
    }
}