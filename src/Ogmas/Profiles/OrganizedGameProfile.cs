using System;
using AutoMapper;
using Ogmas.Models.Dtos.Create;
using Ogmas.Models.Dtos.Get;
using Ogmas.Models.Entities;
using Ogmas.Profiles.ValueConverters;

namespace Ogmas.Profiles
{
    public class OrganizedGameProfile : Profile
    {
        public OrganizedGameProfile()
        {
            CreateMap<HostGameOptions, OrganizedGame>()
                .ForMember(x => x.StartInterval, opt => opt.ConvertUsing<TimeSpanValueConverter, double>());

            CreateMap<OrganizedGame, OrganizedGameResponse>()
                .ForMember(x => x.StartInterval, opt => opt.ConvertUsing<TimeSpanValueConverter, TimeSpan>());
        }
    }
}