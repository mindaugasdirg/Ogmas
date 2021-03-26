using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Dtos;

namespace Ogmas.Services.Abstractions
{
    public interface IAnswersService
    {
        Task<TaskAnswerResponse> GetAnswer(string answerId);
        IEnumerable<TaskAnswerResponse> GetQuestionAnswers(string questionId);
    }
}