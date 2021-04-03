using AutoMapper;
using Ogmas.Models.Dtos.Create;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;

namespace Ogmas.Profiles
{
    public class GameProfile : Profile
    {
        public GameProfile()
        {
            CreateMap<CreateGameConfiguration, Game>();

            CreateMap<Game, GameResponse>();
        }
    }
}