using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ogmas.Models.Entities;
using Ogmas.Repositories.Abstractions;

namespace Ogmas.Repositories
{
    public class TaskAnswersRepository : BaseEntityRepository<TaskAnswer>, ITaskAnswersRepository
    {
        public TaskAnswersRepository(DatabaseContext context) : base(context)
        {
        }

        protected override IQueryable<TaskAnswer> Query() => Context.TaskAnswers.Include(x => x.GameTask);

        public IEnumerable<TaskAnswer> GetAnswersByQuestion(string questionId)
        {
            return Filter(x => x.GameTaskId == questionId);
        }
    }
}