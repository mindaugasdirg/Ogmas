using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;
using Ogmas.Repositories;
using Ogmas.Services.Abstractions;

namespace Ogmas.Services
{
    public class PlayersService : IPlayersService
    {
        private readonly IMapper mapper;
        private readonly GameParticipantsRepository gameParticipantsRepository;
        private readonly OrganizedGamesRepository organizedGamesRepository;

        public PlayersService(IMapper _mapper, GameParticipantsRepository _gameParticipantsRepository, OrganizedGamesRepository _organizedGamesRepository)
        {
            mapper = _mapper;
            gameParticipantsRepository = _gameParticipantsRepository;
            organizedGamesRepository = _organizedGamesRepository;
        }

        public IEnumerable<PlayerResponse> GetPlayers(string gameId)
        {
            var participants = gameParticipantsRepository.GetParticipantsByGame(gameId);
            return participants.Select(x => mapper.Map<PlayerResponse>(x));
        }

        public async Task<PlayerResponse> JoinGame(string gameId, string userId)
        {
            var game = await organizedGamesRepository.Get(gameId);
            var players = gameParticipantsRepository.GetParticipantsByGame(gameId).Count();
            
            var participant = new GameParticipant
            {
                GameId = gameId,
                PlayerId = userId,
                StartTime = game.StartTime.Add(players * game.StartInterval)
            };

            var added = await gameParticipantsRepository.Add(participant);

            return mapper.Map<PlayerResponse>(added);
        }

        public async Task<PlayerResponse> LeaveGame(string playerId)
        {
            var player = await gameParticipantsRepository.Delete(playerId);
            return mapper.Map<PlayerResponse>(player);
        }
    }
}