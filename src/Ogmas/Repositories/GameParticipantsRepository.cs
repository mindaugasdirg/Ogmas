using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Ogmas.Models.Entities;
using Ogmas.Repositories.Abstractions;

namespace Ogmas.Repositories
{
    public class GameParticipantsRepository : BaseEntityRepository<GameParticipant>, IGameParticipantsRepository
    {
        public GameParticipantsRepository(DatabaseContext context) : base(context)
        {
        }

        protected override IQueryable<GameParticipant> Query() => Context.GameParticipants.Include(x => x.Game);

        public IEnumerable<GameParticipant> GetParticipantsByGame(string gameId)
        {
            return Filter(x => x.GameId == gameId);
        }

        public GameParticipant GetParticipantByGameAndUser(string gameId, string userId)
        {
            return Filter(x => x.GameId == gameId && x.PlayerId == userId).FirstOrDefault();
        }
    }
}