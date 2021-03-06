using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Ogmas.Exceptions;
using Ogmas.Models.Dtos.Create;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;
using Ogmas.Repositories.Abstractions;
using Ogmas.Services.Abstractions;

namespace Ogmas.Services
{
    public class GameTypesService : IGameTypesService
    {
        private readonly IMapper mapper;
        private readonly IGamesRepository gamesRepository;
        private readonly IGameTasksRepository gameTasksRepository;
        private readonly ITaskAnswersRepository taskAnswersRepository;

        public GameTypesService(IMapper _mapper, IGamesRepository _gamesRepository, IGameTasksRepository _gameTasksRepository, ITaskAnswersRepository _taskAnswersRepository)
        {
            mapper = _mapper;
            gamesRepository = _gamesRepository;
            gameTasksRepository = _gameTasksRepository;
            taskAnswersRepository = _taskAnswersRepository;
        }

        public async Task<GameResponse> CreateGame(CreateGameConfiguration gameOptions, string user)
        {
            var game = mapper.Map<Game>(gameOptions);
            game.CreatedBy = user;
            game = await gamesRepository.Add(game);
            await CreateTasks(game.Id, gameOptions.Tasks);
            game.Ready = true;
            game = await gamesRepository.Update(game);
            return mapper.Map<GameResponse>(game);
        }

        public IEnumerable<GameResponse> GetGames(string user)
        {
            var games = gamesRepository.Filter(g => g.CreatedBy == user || g.CreatedBy == "");
            return games.Select(g => mapper.Map<GameResponse>(g));
        }

        public GameResponse GetGame(string id, string user)
        {
            var game = gamesRepository.Filter(g => g.Id == id && (g.CreatedBy == user || g.CreatedBy == "")).FirstOrDefault();
            if(game is null)
                throw new NotFoundException("game does not exist");
            return mapper.Map<GameResponse>(game);
        }

        private async Task CreateTasks(string gameId, IEnumerable<CreateTask> tasks)
        {
            foreach(var taskDto in tasks)
            {
                var task = mapper.Map<GameTask>(taskDto);
                task.GameId = gameId;
                var createdTask = await gameTasksRepository.Add(task);
                await CreateAnswers(createdTask.Id, taskDto.Answers);
            }
        }

        private async Task CreateAnswers(string taskId, IEnumerable<CreateTaskAnswer> answers)
        {
            foreach(var answerDto in answers)
            {
                var answer = mapper.Map<TaskAnswer>(answerDto);
                answer.GameTaskId = taskId;
                await taskAnswersRepository.Add(answer);
            }
        }
    }
}