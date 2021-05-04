using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Ogmas.Exceptions;
using Ogmas.Models.Dtos.Get;
using Ogmas.Repositories.Abstractions;
using Ogmas.Services.Abstractions;

namespace Ogmas.Services
{
    public class GameTasksService : IGameTasksService
    {
        private readonly IMapper mapper;
        private readonly IGameTasksRepository gameTasksRepository;

        public GameTasksService(IMapper _mapper, IGameTasksRepository _gameTasksRepository)
        {
            mapper = _mapper;
            gameTasksRepository = _gameTasksRepository;
        }

        public GameTaskResponse GetQuestion(string id)
        {
            var task = gameTasksRepository.Get(id);
            if(task is null)
                throw new NotFoundException("Question does not exist");
            return mapper.Map<GameTaskResponse>(task);
        }

        public IEnumerable<GameTaskResponse> GetQuestionsByGame(string gameId)
        {
            var tasks = gameTasksRepository.GetTasksByGame(gameId);
            return tasks.Select(t => mapper.Map<GameTaskResponse>(t));
        }
    }
}