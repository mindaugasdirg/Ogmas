using System.Linq;
using System.Security.Claims;

namespace Ogmas.Utilities
{
    public static class ClaimsUtilities
    {
        public static string GetSubClaim(this ClaimsPrincipal user) => user.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
    }
}