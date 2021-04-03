using AutoMapper;
using Ogmas.Models.Dtos.Create;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;

namespace Ogmas.Profiles
{
    public class GameTaskProfile : Profile
    {
        public GameTaskProfile()
        {
            CreateMap<CreateTask, GameTask>();

            CreateMap<GameTask, GameTaskResponse>();
        }
    }
}