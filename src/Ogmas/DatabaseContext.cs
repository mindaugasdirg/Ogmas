using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Ogmas.Models.Entities;

namespace Ogmas
{
    public class DatabaseContext : ApiAuthorizationDbContext<User>
    {
        public DbSet<Game> Games { get; set; }
        public DbSet<GameParticipant> GameParticipants { get; set; }
        public DbSet<GameTask> GameTasks { get; set; }
        public DbSet<OrganizedGame> OrganizedGames { get; set; }
        public DbSet<SubmitedAnswer> SubmitedAnswers { get; set; }
        public DbSet<TaskAnswer> TaskAnswers { get; set; }

        public DatabaseContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }
    }
}