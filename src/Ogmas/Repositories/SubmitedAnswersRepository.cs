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

        public async Task<IEnumerable<SubmitedAnswer>> GetAnswersByPlayer(Guid playerId)
        {
            return await Filter(x => x.PlayerId == playerId);
        }

        public async Task<IEnumerable<SubmitedAnswer>> GetAnswersByGame(Guid gameId)
        {
            return await Filter(x => x.GameId == gameId);
        }
    }
}