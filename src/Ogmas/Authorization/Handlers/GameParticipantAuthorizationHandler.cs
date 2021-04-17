using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Ogmas.Authorization.Requirements;
using Ogmas.Models.Entities;
using Ogmas.Utilities;

namespace Ogmas.Authorization.Handlers
{
    public class GameParticipantAuthorizationHandler : AuthorizationHandler<PlayerRequirement, GameParticipant>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PlayerRequirement requirement, GameParticipant resource)
        {
            var subClaim = context.User.GetSubClaim();
            if(resource.PlayerId == subClaim)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}