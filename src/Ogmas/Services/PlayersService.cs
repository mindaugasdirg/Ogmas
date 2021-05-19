using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Ogmas.Authorization.Requirements;
using Ogmas.Exceptions;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;
using Ogmas.Repositories.Abstractions;
using Ogmas.Services.Abstractions;

namespace Ogmas.Services
{
    public class PlayersService : IPlayersService
    {
        private readonly IAuthorizationService authorizationService;
        private readonly IMapper mapper;
        private readonly IGameParticipantsRepository gameParticipantsRepository;
        private readonly IOrganizedGamesRepository organizedGamesRepository;
        private readonly ISubmitedAnswersRepository submitedAnswersRepository;
        private readonly IGamesRepository gamesRepository;
        private readonly ITaskAnswersRepository taskAnswersRepository;
        private readonly IUserRepository userRepository;
        private readonly IHttpContextAccessor httpContextAccessor;

        public PlayersService(IAuthorizationService _authorizationService, IMapper _mapper, IGameParticipantsRepository _gameParticipantsRepository,
                              IOrganizedGamesRepository _organizedGamesRepository, ISubmitedAnswersRepository _submitedAnswersRepository,
                              IGamesRepository _gamesRepository, ITaskAnswersRepository _taskAnswersRepository, IUserRepository _userRepository,
                              IHttpContextAccessor _httpContextAccessor)
        {
            authorizationService = _authorizationService;
            mapper = _mapper;
            gameParticipantsRepository = _gameParticipantsRepository;
            organizedGamesRepository = _organizedGamesRepository;
            submitedAnswersRepository = _submitedAnswersRepository;
            gamesRepository = _gamesRepository;
            taskAnswersRepository = _taskAnswersRepository;
            userRepository = _userRepository;
            httpContextAccessor = _httpContextAccessor;
        }

        public IEnumerable<SubmitedAnswerResponse> GetPlayerAnswers(string gameId, string playerId)
        {
            var player = gameParticipantsRepository.Filter(x => x.GameId == gameId && x.Id == playerId).FirstOrDefault();
            if(player is null)
                throw new NotFoundException("User does not participate in the game");
            var answers = submitedAnswersRepository.GetAnswersByPlayer(player.Id);
            return answers.Select(x => mapper.Map<SubmitedAnswerResponse>(x));
        }

        public IEnumerable<PlayerResponse> GetPlayers(string gameId)
        {
            var participants = gameParticipantsRepository.GetParticipantsByGame(gameId);
            return participants.Select(x => mapper.Map<PlayerResponse>(x));
        }
        
        public PlayerResponse GetPlayer(string playerId)
        {
            var player = gameParticipantsRepository.Get(playerId);
            if(player is null)
                throw new NotFoundException("User does not participate in the game");

            return mapper.Map<PlayerResponse>(player);
        }
        
        public string GetUsername(string playerId)
        {
            var player = gameParticipantsRepository.Get(playerId);
            if(player is null)
                throw new NotFoundException("User does not participate in the game");

            var username = userRepository.GetUsername(player.PlayerId);

            return username;
        }

        public async Task<PlayerResponse> JoinGame(string gameId, string userId)
        {
            var game = organizedGamesRepository.Get(gameId);
            if(game is null)
                throw new NotFoundException("game does not exist");
            if(game.StartTime.CompareTo(DateTime.UtcNow) <= 0)
                throw new InvalidActionException("game has already started");

            var playerFound = gameParticipantsRepository.Filter(x => x.GameId == gameId && x.PlayerId == userId).FirstOrDefault();
            if(!(playerFound is null))
                throw new InvalidActionException("player is already in game");
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
            var found = gameParticipantsRepository.Get(playerId);
            if(found is null)
                throw new NotFoundException("player does not exist");
            
            var player = await gameParticipantsRepository.Delete(playerId);
            return mapper.Map<PlayerResponse>(player);
        }

        public async Task<SubmitedAnswerResponse> SubmitAnswer(string gameId, string playerId, string questionId, string answerId)
        {
            var player = gameParticipantsRepository.GetParticipantByGameAndUser(gameId, playerId);
            if(player is null)
                throw new NotFoundException("Player is not in the game");

            var userClaims = httpContextAccessor.HttpContext.User;
            var authorizeResult = await authorizationService.AuthorizeAsync(userClaims, player, new [] { new PlayerRequirement() });
            if(!authorizeResult.Succeeded)
                throw new ForbiddenException("Cannot submit answer for other player");

            var answered = submitedAnswersRepository.Filter(x => x.GameId == gameId && x.PlayerId == player.Id && x.QuestionId == questionId);
            if(answered.Count() != 0)
                throw new InvalidActionException("Question is already answered");

            var organizedGame = organizedGamesRepository.Get(gameId);
            var game = gamesRepository.Get(organizedGame.GameTypeId);
            if(game is null)
                throw new NotFoundException("Game does not exist");

            var answer = taskAnswersRepository.Filter(x => x.Id == answerId && x.GameTask.Id == questionId && x.GameTask.GameId == game.Id);
            if(answer.Count() != 1)
                throw new NotFoundException("Answer for this question in this game was not found");

            var submited = await submitedAnswersRepository.Add(new SubmitedAnswer()
            {
                GameId = gameId,
                PickedAnswerId = answerId,
                PlayerId = player.Id,
                QuestionId = questionId
            });

            return mapper.Map<SubmitedAnswerResponse>(submited);
        }

        public async Task<PlayerResponse> FinishGame(string playerId, DateTime time)
        {
            var player = gameParticipantsRepository.Get(playerId);
            if(player is null)
                throw new NotFoundException("Player is not in the game");

            player.FinishTime = time;
            var updated = await gameParticipantsRepository.Update(player);
            return mapper.Map<PlayerResponse>(updated);
        }
    }
}