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

        public IEnumerable<GameParticipant> GetParticipantsByGame(string gameId)
        {
            return Filter(x => x.GameId == gameId);
        }
    }
}