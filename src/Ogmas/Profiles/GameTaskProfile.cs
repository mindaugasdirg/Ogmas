using AutoMapper;
using Ogmas.Models.Dtos;
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