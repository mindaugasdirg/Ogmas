using System;
using System.Linq;
using NUnit.Framework;
using Ogmas.Models.Entities;
using Ogmas.Repositories;
using Ogmas.UnitTests.Helpers;
using Shouldly;

namespace Ogmas.UnitTests.Repositories
{
    [TestFixture]
    public class SubmitedAnswersRepositoryTests
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
        public void GetAnswersByPlayer_WhenParticipantsIdIsProvided_ShouldReturnPlayersAnswers()
        {
            var (game, answer) = CreateGameWithQuestion();
            var (player, pickedAnswer) = AddPlayerToGame(game, answer);
            AddPlayerToGame(game, answer);
            var repository = new SubmitedAnswersRepository(_dbContext);

            var found = repository.GetAnswersByPlayer(player);

            found.Count().ShouldBe(1);
            found.First().PickedAnswerId.ShouldBe(answer);
            found.First().PlayerId.ShouldBe(player);
        }

        [Test]
        public void GetAnswersByGame_WhenGameIdIsProvided_ShouldReturnAllGamesAnswers()
        {
            var (game, answer) = CreateGameWithQuestion();
            var (player, pickedAnswer) = AddPlayerToGame(game, answer);
            AddPlayerToGame(game, answer);
            var repository = new SubmitedAnswersRepository(_dbContext);

            var found = repository.GetAnswersByGame(game);

            found.Count().ShouldBe(2);
            found.All(x => x.GameId == game).ShouldBeTrue();
        }

        private (string, string) CreateGameWithQuestion()
        {
            var user = _dbContext.Users.Add(new User { UserName = "aaa" });
            _dbContext.SaveChanges();

            var game = _dbContext.Games.Add(new Game
            {
                Name = "Test game",
                CreatedBy = "user",
                Ready = true
            });
            _dbContext.SaveChanges();

            var question = _dbContext.GameTasks.Add(new GameTask
            {
                Game = game.Entity,
                Question = "Test question",
                Hint = "Test hint"
            });
            _dbContext.SaveChanges();

            var answer = _dbContext.TaskAnswers.Add(new TaskAnswer
            {
                Answer = "Test answer",
                IsCorrect = true
            });
            _dbContext.SaveChanges();

            var organizedGame = _dbContext.OrganizedGames.Add(new OrganizedGame
            {
                StartTime = DateTime.UtcNow,
                StartInterval = TimeSpan.FromMinutes(5),
                Organizer = user.Entity,
                GameType = game.Entity
            });
            _dbContext.SaveChanges();

            return (organizedGame.Entity.Id, answer.Entity.Id);
        }

        private (string, string) AddPlayerToGame(string game, string answer)
        {
            var user = _dbContext.Users.Add(new User { UserName = "aaa" });
            _dbContext.SaveChanges();

            var player = _dbContext.GameParticipants.Add(new GameParticipant
            {
                StartTime = DateTime.UtcNow,
                GameId = game,
                Player = user.Entity
            });
            _dbContext.SaveChanges();

            var submitedAnswer = _dbContext.SubmitedAnswers.Add(new SubmitedAnswer
            {
                GameId = game,
                PickedAnswerId = answer,
                Player = player.Entity
            });
            _dbContext.SaveChanges();

            return (player.Entity.Id, submitedAnswer.Entity.Id);
        }
    }
}