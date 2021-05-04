using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Ogmas.Exceptions;
using Ogmas.Models.Dtos.Get;
using Ogmas.Repositories.Abstractions;
using Ogmas.Services.Abstractions;

namespace Ogmas.Services
{
    public class AnswersService : IAnswersService
    {
        private readonly IMapper mapper;
        private readonly ITaskAnswersRepository taskAnswersRepository;

        public AnswersService(IMapper _mapper, ITaskAnswersRepository _taskAnswersRepository)
        {
            mapper = _mapper;
            taskAnswersRepository = _taskAnswersRepository;
        }
        
        public TaskAnswerResponse GetAnswer(string id)
        {
            var answer = taskAnswersRepository.Get(id);
            if(answer is null)
                throw new NotFoundException("answer does not exist");
            return mapper.Map<TaskAnswerResponse>(answer);
        }

        public IEnumerable<TaskAnswerResponse> GetQuestionAnswers(string questionId)
        {
            var answers = taskAnswersRepository.GetAnswersByQuestion(questionId);
            return answers.Select(a => mapper.Map<TaskAnswerResponse>(a));
        }
    }
}