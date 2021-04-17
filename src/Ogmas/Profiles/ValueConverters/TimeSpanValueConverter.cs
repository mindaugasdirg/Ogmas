using System;
using AutoMapper;

namespace Ogmas.Profiles.ValueConverters
{
    public class TimeSpanValueConverter : IValueConverter<double, TimeSpan>, IValueConverter<TimeSpan, double>
    {
        public TimeSpan Convert(double sourceMember, ResolutionContext context)
        {
            return TimeSpan.FromSeconds(sourceMember);
        }

        public double Convert(TimeSpan sourceMember, ResolutionContext context)
        {
            return sourceMember.TotalSeconds;
        }
    }
}