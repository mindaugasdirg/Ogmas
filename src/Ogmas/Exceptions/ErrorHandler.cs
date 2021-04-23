using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Ogmas.Models.Dtos.Get;

namespace Ogmas.Exceptions
{
    public static class ErrorHandler
    {
        public static async Task HandleError(HttpContext context)
        {
            var exception = context.Features.Get<IExceptionHandlerPathFeature>().Error;

            var error = new ErrorResponse()
            {
                ErrorType = exception.GetType().Name,
                Message = exception.Message
            };

            context.Response.StatusCode = exception switch
            {
                InvalidActionException e => context.Response.StatusCode = 400,
                NotFoundException e => context.Response.StatusCode = 404,
                ArgumentException e => context.Response.StatusCode = 400,
                _ => context.Response.StatusCode = 500
            };
            await context.Response.WriteJsonAsync(error, "application/json");
        }
    }
}