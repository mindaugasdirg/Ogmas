using System.Collections.Generic;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories.Abstractions
{
    public interface IGameParticipantsRepository : IBaseEntityRepository<GameParticipant>
    {
        IEnumerable<GameParticipant> GetParticipantsByGame(string gameId);

        GameParticipant GetParticipantByGameAndUser(string gameId, string userId);
    }
}