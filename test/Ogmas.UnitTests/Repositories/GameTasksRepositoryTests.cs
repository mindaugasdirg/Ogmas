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
    public class GameTasksRepositoryTests
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
        public async Task GetTasksByGame_WhenCalled_ShouldReturnGameTasks()
        {
            var repository = new GameTasksRepository(_dbContext);
            var game = _dbContext.Add(new Game
            {
                Name = "Example game",
                CreatedBy = "user",
                Ready = true
            });
            _dbContext.SaveChanges();

            for(int i = 0; i < 4; ++i)
            {
                await repository.Add(new GameTask
                {
                    Game = game.Entity,
                    Question = $"Example question {i}",
                    Hint = $"Hint {i}"
                });
            }

            var questions = repository.GetTasksByGame(game.Entity.Id);

            questions.Count().ShouldBe(4);
        }
    }
}