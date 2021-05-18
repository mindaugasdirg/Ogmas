using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Ogmas.Authorization.Requirements;
using Ogmas.Exceptions;
using Ogmas.Models.Dtos.Create;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;
using Ogmas.Repositories.Abstractions;
using Ogmas.Services.Abstractions;

namespace Ogmas.Services
{
    public class GamesService : IGamesService
    {
        private readonly IAuthorizationService authorizationService;
        private readonly IMapper mapper;
        private readonly IOrganizedGamesRepository organizedGamesRepository;
        private readonly IGamesRepository gamesRepository;
        private readonly IHttpContextAccessor httpContextAccessor;

        public GamesService(IAuthorizationService _authorizationService, IMapper _mapper, IOrganizedGamesRepository _organizedGamesRepository,
                            IGamesRepository _gamesRepository, IHttpContextAccessor _httpContextAccessor)
        {
            authorizationService = _authorizationService;
            mapper = _mapper;
            organizedGamesRepository = _organizedGamesRepository;
            gamesRepository = _gamesRepository;
            httpContextAccessor = _httpContextAccessor;
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

            var userClaims = httpContextAccessor.HttpContext.User;
            var authorizeResult = await authorizationService.AuthorizeAsync(null, game, new [] { new HostRequirement() });
            if(!authorizeResult.Succeeded)
                throw new ForbiddenException("User is not host");

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