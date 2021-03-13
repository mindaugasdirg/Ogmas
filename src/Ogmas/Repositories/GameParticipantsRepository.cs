using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories
{
    public class GameParticipantsRepository : BaseEntityRepository<GameParticipant>
    {
        public GameParticipantsRepository(DatabaseContext context) : base(context)
        {
        }

        public async Task<IEnumerable<GameParticipant>> GetParticipantsByGame(Guid gameId)
        {
            return await Filter(x => x.GameId == gameId);
        }
    }
}