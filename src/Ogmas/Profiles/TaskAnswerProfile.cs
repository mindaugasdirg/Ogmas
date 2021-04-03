using AutoMapper;
using Ogmas.Models.Dtos.Create;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;

namespace Ogmas.Profiles
{
    public class TaskAnswerProfile : Profile
    {
        public TaskAnswerProfile()
        {
            CreateMap<CreateTaskAnswer, TaskAnswer>();

            CreateMap<TaskAnswer, TaskAnswerResponse>();
        }
    }
}