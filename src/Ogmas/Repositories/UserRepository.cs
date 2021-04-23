using System.Linq;

namespace Ogmas.Repositories
{
    public class UserRepository
    {
        protected readonly DatabaseContext context;

        public UserRepository(DatabaseContext _context)
        {
            context = _context;
        }

        public string GetUsername(string userId)
        {
            return context.Users.Where(x => x.Id == userId).Select(x => x.UserName).FirstOrDefault();
        }
    }
}