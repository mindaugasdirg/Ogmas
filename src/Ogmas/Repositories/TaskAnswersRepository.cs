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

        public async Task<IEnumerable<TaskAnswer>> GetAnswersByQuestion(Guid questionId)
        {
            return await Filter(x => x.GameTaskId == questionId);
        }
    }
}