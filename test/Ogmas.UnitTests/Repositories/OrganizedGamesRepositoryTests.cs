using System;
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
    public class OrganizedGamesRepositoryTests
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
        public void GetGamesByOrganizer_WhenOrganizerIdIsProvided_ShouldReturnGameList()
        {
            var (user, type) = AddOrganizedGame();
            AddOrganizedGame();
            var repository = new OrganizedGamesRepository(_dbContext);

            var found = repository.GetGamesByOrganizer(user);

            found.Count().ShouldBe(1);
            found.First().OrganizerId.ShouldBe(user);
        }

        [Test]
        public void GetGamesByType_WhenGameIdIsProvided_ShouldReturnGameList()
        {
            var (user, type) = AddOrganizedGame();
            AddOrganizedGame();
            var repository = new OrganizedGamesRepository(_dbContext);

            var found = repository.GetGamesByType(type);

            found.Count().ShouldBe(1);
            found.First().GameTypeId.ShouldBe(type);
        }

        private (string, string) AddOrganizedGame()
        {
            var user = _dbContext.Users.Add(new User
            {
                UserName = "aaa"
            });
            _dbContext.SaveChanges();

            var game = _dbContext.Games.Add(new Game
            {
                Name = "Test game",
                Ready = true
            });
            _dbContext.SaveChanges();

            var organizedGame = _dbContext.OrganizedGames.Add(new OrganizedGame
            {
                StartTime = DateTime.UtcNow,
                StartInterval = TimeSpan.FromMinutes(5),
                GameType = game.Entity,
                Organizer = user.Entity
            });

            return (user.Entity.Id, game.Entity.Id);
        }
    }
}