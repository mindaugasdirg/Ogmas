using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Ogmas.Exceptions;
using Ogmas.Models.Dtos.Create;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;
using Ogmas.Repositories;
using Ogmas.Services.Abstractions;

namespace Ogmas.Services
{
    public class GamesService : IGamesService
    {
        private readonly IMapper mapper;
        private readonly OrganizedGamesRepository organizedGamesRepository;
        private readonly GamesRepository gamesRepository;

        public GamesService(IMapper _mapper, OrganizedGamesRepository _organizedGamesRepository, GamesRepository _gamesRepository)
        {
            mapper = _mapper;
            organizedGamesRepository = _organizedGamesRepository;
            gamesRepository = _gamesRepository;
        }

        public async Task<OrganizedGameResponse> CreateGame(string userId, HostGameOptions options)
        {
            var gameType = gamesRepository.Get(options.GameTypeId);
            if(gameType is null)
                throw new NotFoundException("game type does not exist");

            var organizedGame = mapper.Map<OrganizedGame>(options);
            organizedGame.OrganizerId = userId;
            organizedGame = await organizedGamesRepository.Add(organizedGame);
            return mapper.Map<OrganizedGameResponse>(organizedGame);
        }
        
        public async Task<OrganizedGameResponse> DeleteGame(string id)
        {
            var game = organizedGamesRepository.Get(id);
            if(game is null)
                throw new NotFoundException("hosted game does not exist");

            if(game.StartTime.CompareTo(DateTime.UtcNow) <= 0)
            {
                throw new InvalidActionException("Game has already started");
            }

            var deleted = await organizedGamesRepository.Delete(id);
            return mapper.Map<OrganizedGameResponse>(deleted);
        }

        public OrganizedGameResponse GetGame(string id)
        {
            var game = organizedGamesRepository.Get(id);
            if(game is null)
                throw new NotFoundException("hosted game does not exist");
            return mapper.Map<OrganizedGameResponse>(game);
        }

        public IEnumerable<OrganizedGameResponse> GetGames(string hostId)
        {
            var games = organizedGamesRepository.GetGamesByOrganizer(hostId);
            return games.Select(g => mapper.Map<OrganizedGameResponse>(g));
        }
    }
}