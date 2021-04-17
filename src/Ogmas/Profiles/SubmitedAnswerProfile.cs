using AutoMapper;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;

namespace Ogmas.Profiles
{
    public class SubmitedAnswerProfile : Profile
    {
        public SubmitedAnswerProfile()
        {
            CreateMap<SubmitedAnswer, SubmitedAnswerResponse>();
        }
    }
}