using System.Data.Common;
using IdentityServer4.EntityFramework.Options;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Ogmas.UnitTests.Helpers
{
    public static class DatabaseContextHelper
    {
        public static DatabaseContext CreateDatabaseContext()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseSqlite(CreateConnection())
                .Options;

            var operationalStoreOptions = new OperationalStoreOptions();

            var dbContext = new DatabaseContext(dbContextOptions, Options.Create(operationalStoreOptions));
            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();

            return dbContext;
        }

        private static DbConnection CreateConnection()
        {
            var connection = new SqliteConnection("Filename=:memory:");
            connection.Open();
            return connection;
        }

        public static void DisposeConnection(DatabaseContext dbContext)
        {
            var connection = dbContext.Database.GetDbConnection();
            connection.Dispose();
        }
    }
}