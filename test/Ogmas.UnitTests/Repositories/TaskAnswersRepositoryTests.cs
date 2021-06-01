using System.Linq;
using NUnit.Framework;
using Ogmas.Models.Entities;
using Ogmas.Repositories;
using Ogmas.UnitTests.Helpers;
using Shouldly;

namespace Ogmas.UnitTests.Repositories
{
    [TestFixture]
    public class TaskAnswersRepositoryTests
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
        public void GetAnswersByQuestion_WhenQuestionIdIsProvided_ShouldReturnQuestionAnswers()
        {
            var question = CreateGameWithQuestion();
            var repository = new TaskAnswersRepository(_dbContext);

            var found = repository.GetAnswersByQuestion(question);

            found.Count().ShouldBe(2);
        }

        private string CreateGameWithQuestion()
        {
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

            var answer1 = _dbContext.TaskAnswers.Add(new TaskAnswer
            {
                GameTask = question.Entity,
                Answer = "Test answer 2",
                IsCorrect = true
            });
            var answer2 = _dbContext.TaskAnswers.Add(new TaskAnswer
            {
                GameTask = question.Entity,
                Answer = "Test answer 1",
                IsCorrect = false
            });
            _dbContext.SaveChanges();

            return question.Entity.Id;
        }
    }
}