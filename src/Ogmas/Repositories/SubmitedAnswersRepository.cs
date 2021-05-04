using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ogmas.Models.Entities;
using Ogmas.Repositories.Abstractions;

namespace Ogmas.Repositories
{
    public class SubmitedAnswersRepository : BaseEntityRepository<SubmitedAnswer>, ISubmitedAnswersRepository
    {
        public SubmitedAnswersRepository(DatabaseContext context) : base(context)
        {
        }

        protected override IQueryable<SubmitedAnswer> Query() => Context.SubmitedAnswers.Include(x => x.PickedAnswer).Include(x => x.Game).Include(x => x.Question);

        public IEnumerable<SubmitedAnswer> GetAnswersByPlayer(string playerId)
        {
            return Filter(x => x.PlayerId == playerId);
        }

        public IEnumerable<SubmitedAnswer> GetAnswersByGame(string gameId)
        {
            return Filter(x => x.GameId == gameId);
        }
    }
}