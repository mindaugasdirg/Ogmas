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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Game>()
                .HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<GameParticipant>()
                .HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<GameTask>()
                .HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<OrganizedGame>()
                .HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<SubmitedAnswer>()
                .HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<TaskAnswer>()
                .HasQueryFilter(x => !x.IsDeleted);
        }
    }
}