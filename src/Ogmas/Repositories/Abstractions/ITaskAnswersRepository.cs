using System.Collections.Generic;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories.Abstractions
{
    public interface ITaskAnswersRepository : IBaseEntityRepository<TaskAnswer>
    {
        IEnumerable<TaskAnswer> GetAnswersByQuestion(string questionId);
    }
}