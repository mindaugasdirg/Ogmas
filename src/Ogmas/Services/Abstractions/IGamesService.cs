using System.Threading.Tasks;
using Ogmas.Models.Dtos;

namespace Ogmas.Services.Abstractions
{
    public interface IGamesService
    {
        Task CreateGame(CreateGame gameOptions);
    }
}