using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Entities;

namespace Ogmas.Services.Abstractions
{
    public interface IQuestionsService
    {
        Task GetQuestion(string questionId);
        Task<IEnumerable<GameTask>> GetGameQuestions(string gameId);
    }
}