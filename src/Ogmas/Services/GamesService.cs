using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Ogmas.Models.Dtos;
using Ogmas.Models.Entities;
using Ogmas.Repositories;
using Ogmas.Services.Abstractions;

namespace Ogmas.Services
{
    public class GamesService : IGamesService
    {
        private readonly IMapper mapper;
        private readonly GamesRepository gamesRepository;
        private readonly GameTasksRepository gameTasksRepository;
        private readonly TaskAnswersRepository taskAnswersRepository;

        public GamesService(IMapper _mapper, GamesRepository _gamesRepository, GameTasksRepository _gameTasksRepository, TaskAnswersRepository _taskAnswersRepository)
        {
            mapper = _mapper;
            gamesRepository = _gamesRepository;
            gameTasksRepository = _gameTasksRepository;
            taskAnswersRepository = _taskAnswersRepository;
        }

        public async Task CreateGame(CreateGame gameOptions)
        {
            var game = await gamesRepository.Add(mapper.Map<Game>(gameOptions));
            await CreateTasks(game.Id, gameOptions.Tasks);
            game.Ready = true;
            game = await gamesRepository.Update(game);
        }

        private async Task CreateTasks(string gameId, IEnumerable<CreateTask> tasks)
        {
            foreach(var taskDto in tasks)
            {
                var task = mapper.Map<GameTask>(taskDto);
                task.GameId = gameId;
                var createdTask = await gameTasksRepository.Add(task);
            }
        }

        private async Task CreateAnswers(string taskId, IEnumerable<CreateTaskAnswer> answers)
        {
            foreach(var answerDto in answers)
            {
                var answer = mapper.Map<TaskAnswer>(answerDto);
                answer.GameTaskId = taskId;
                var createdAnswer = await taskAnswersRepository.Add(answer);
            }
        }
    }
}