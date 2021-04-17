using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Ogmas.Authorization.Requirements;
using Ogmas.Models.Entities;
using Ogmas.Utilities;

namespace Ogmas.Authorization.Handlers
{
    public class OrganizedGameAuthorizationHandler : AuthorizationHandler<HostRequirement, OrganizedGame>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, HostRequirement requirement, OrganizedGame resource)
        {
            var subClaim = context.User.GetSubClaim();
            if(!(subClaim is null) && subClaim == resource.OrganizerId)
                context.Succeed(requirement);
            
            return Task.CompletedTask;
        }
    }
}