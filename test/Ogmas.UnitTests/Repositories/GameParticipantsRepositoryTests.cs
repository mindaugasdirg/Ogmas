using System;
using System.Collections.Generic;
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
    public class GameParticipantsRepositoryTests
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
        public async Task GetParticipantsByGame_WhenGameIdIsProvided_ShouldReturnReturnGamesParticipants()
        {
            var repository = new GameParticipantsRepository(_dbContext);

            var user = _dbContext.Users.Add(new User
            {
                UserName = "aaa"
            });
            _dbContext.SaveChanges();
            var user1Id = user.Entity.Id;
            var user2 = _dbContext.Users.Add(new User
            {
                UserName = "bbb"
            });
            _dbContext.SaveChanges();
            var user2Id = user2.Entity.Id;

            var games = new List<string>()
            {
                await CreateGameWithPlayer(repository, user1Id),
                await CreateGameWithPlayer(repository, user2Id)
            };

            var found = repository.GetParticipantsByGame(games[0]);

            found.Count().ShouldBe(1);
            var player = found.First();
            player.PlayerId.ShouldBe(user.Entity.Id);
        }

        private async Task<string> CreateGameWithPlayer(GameParticipantsRepository repository, string userId)
        {
            var game = _dbContext.Games.Add(new Game
            {
                Name = $"game_{Guid.NewGuid()}",
                IsDeleted = false,
                Ready = true
            });
            _dbContext.SaveChanges();
            var organizedGame = _dbContext.OrganizedGames.Add(new OrganizedGame
            {
                GameTypeId = game.Entity.Id,
                OrganizerId = userId
            });
            var gameId = organizedGame.Entity.Id;
            await repository.Add(new GameParticipant
            {
                StartTime = DateTime.UtcNow,
                PlayerId = userId,
                GameId = gameId
            });

            return gameId;
        }
    }
}