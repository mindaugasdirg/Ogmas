using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Ogmas.Models.Dtos.Get;
using Ogmas.Repositories;
using Ogmas.Services.Abstractions;

namespace Ogmas.Services
{
    public class GameTasksService : IGameTasksService
    {
        private readonly IMapper mapper;
        private readonly GameTasksRepository gameTasksRepository;

        public GameTasksService(IMapper _mapper, GameTasksRepository _gameTasksRepository)
        {
            mapper = _mapper;
            gameTasksRepository = _gameTasksRepository;
        }

        public GameTaskResponse GetQuestion(string id)
        {
            var task = gameTasksRepository.Get(id);
            if(task is null)
                throw new ArgumentException("Question does not exist");
            return mapper.Map<GameTaskResponse>(task);
        }

        public IEnumerable<GameTaskResponse> GetQuestionsByGame(string gameId)
        {
            var tasks = gameTasksRepository.GetTasksByGame(gameId);
            return tasks.Select(t => mapper.Map<GameTaskResponse>(t));
        }
    }
}