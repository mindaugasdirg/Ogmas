using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Dtos;

namespace Ogmas.Services.Abstractions
{
    public interface IGameTasksService
    {
        IEnumerable<GameTaskResponse> GetQuestionsByGame(string gameId);
        Task<GameTaskResponse> GetQuestion(string id);
    }
}