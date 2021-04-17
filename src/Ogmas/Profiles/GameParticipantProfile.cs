using AutoMapper;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;

namespace Ogmas.Profiles
{
    public class GameParticipantProfile : Profile
    {
        public GameParticipantProfile()
        {
            CreateMap<GameParticipant, PlayerResponse>();
        }
    }
}