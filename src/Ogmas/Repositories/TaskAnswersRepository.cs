using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories
{
    public class TaskAnswersRepository : BaseEntityRepository<TaskAnswer>
    {
        public TaskAnswersRepository(DatabaseContext context) : base(context)
        {
        }

        public IEnumerable<TaskAnswer> GetAnswersByQuestion(string questionId)
        {
            return Filter(x => x.GameTaskId == questionId);
        }
    }
}