using System.Linq;
using System.Threading.Tasks;
using NUnit.Framework;
using Ogmas.Models.Entities;
using Ogmas.Repositories;
using Ogmas.UnitTests.Helpers;
using Shouldly;

namespace Ogmas.UnitTests.Repositories
{
    [TestFixture]
    public class GamesRepositoryTests
    {
        private DatabaseContext _dbContext;

        [SetUp]
        public void Setup()
        {
            _dbContext = DatabaseContextHelper.CreateDatabaseContext();
        }

        [TearDown]
        public void Teardown()
        {
            DatabaseContextHelper.DisposeConnection(_dbContext);
        }

        [Test]
        public async Task GetReadyGames_WhenCalled_ShouldReturnReadyGames()
        {
            var repository = new GamesRepository(_dbContext);
            await repository.Add(new Game
            {
                Name = "Example game",
                Ready = true
            });
            await repository.Add(new Game
            {
                Name = "Example game 1",
                Ready = false
            });

            var found = repository.GetReadyGames();

            found.Count().ShouldBe(1);
            var game = found.First();
            game.Name.ShouldBe("Example game");

        }
    }
}