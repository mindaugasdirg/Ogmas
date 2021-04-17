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
    public class AnswersService : IAnswersService
    {
        private readonly IMapper mapper;
        private readonly TaskAnswersRepository taskAnswersRepository;

        public AnswersService(IMapper _mapper, TaskAnswersRepository _taskAnswersRepository)
        {
            mapper = _mapper;
            taskAnswersRepository = _taskAnswersRepository;
        }
        
        public async Task<TaskAnswerResponse> GetAnswer(string id)
        {
            var answer = await taskAnswersRepository.Get(id);
            if(answer is null)
                throw new ArgumentException("answer does not exist");
            return mapper.Map<TaskAnswerResponse>(answer);
        }

        public IEnumerable<TaskAnswerResponse> GetQuestionAnswers(string questionId)
        {
            var answers = taskAnswersRepository.GetAnswersByQuestion(questionId);
            return answers.Select(a => mapper.Map<TaskAnswerResponse>(a));
        }
    }
}