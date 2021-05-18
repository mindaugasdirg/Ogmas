using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Moq;
using NUnit.Framework;
using Ogmas.Exceptions;
using Ogmas.Models.Entities;
using Ogmas.Profiles;
using Ogmas.Repositories.Abstractions;
using Ogmas.Services;
using Shouldly;

namespace Ogmas.UnitTests.Services
{
    [TestFixture]
    public class AnswersServiceTests
    {
        private Mock<ITaskAnswersRepository> taskAnswersRepositoryMock;
        private IMapper mapper;

        [SetUp]
        public void Setup()
        {
            taskAnswersRepositoryMock = new Mock<ITaskAnswersRepository>();
            var mapperConfiguration = new MapperConfiguration(c =>
            {
                c.AddProfile<TaskAnswerProfile>();
            });
            mapper = new Mapper(mapperConfiguration);
        }

        [Test]
        public void GetAnswer_WhenAnswerExists_ShouldReturnAnswer()
        {
            var returned = new TaskAnswer
            {
                Id = "id",
                IsCorrect = true,
                Location = "location",
                Answer = "asnwer",
                IsDeleted = false,
                GameTaskId = "taskId"
            };
            taskAnswersRepositoryMock.Setup(s => s.Get("id")).Returns(returned);

            var service = new AnswersService(mapper, taskAnswersRepositoryMock.Object);

            var result = service.GetAnswer("id");

            result.Answer.ShouldBe(returned.Answer);
            result.Id.ShouldBe(returned.Id);
            result.IsCorrect.ShouldBe(returned.IsCorrect);
            result.Location.ShouldBe(returned.Location);
        }

        [Test]
        public void GetAnswer_WhenAnswerDoesNotExist_ShouldThrowNotFoundException()
        {
            var returned = new TaskAnswer
            {
                Id = "id",
                IsCorrect = true,
                Location = "location",
                Answer = "asnwer",
                IsDeleted = false,
                GameTaskId = "taskId"
            };
            taskAnswersRepositoryMock.Setup(s => s.Get("id")).Returns(returned);
            var service = new AnswersService(mapper, taskAnswersRepositoryMock.Object);

            Should.Throw<NotFoundException>(() => service.GetAnswer("Not existing"));
        }

        [Test]
        public void GetQuestionAnswers_WhenQuestionExists_ShouldReturnQuestionAnswers()
        {
            var answers = new List<TaskAnswer>()
            {
                new TaskAnswer
                {
                    Id = "id1",
                    IsCorrect = true,
                    Location = "location 1",
                    Answer = "asnwer 1",
                    IsDeleted = false
                },
                new TaskAnswer
                {
                    Id = "id2",
                    IsCorrect = false,
                    Location = "location 2",
                    Answer = "asnwer 2",
                    IsDeleted = false
                }
            };
            taskAnswersRepositoryMock.Setup(s => s.GetAnswersByQuestion("questionId")).Returns(answers);
            var service = new AnswersService(mapper, taskAnswersRepositoryMock.Object);

            var results = service.GetQuestionAnswers("questionId");

            results.ShouldNotBeNull();
            results.Count().ShouldBe(answers.Count);

            for(int i = 0; i < answers.Count; ++i)
            {
                var result = results.ToList()[i];
                var expected = answers[i];

                result.Answer.ShouldBe(expected.Answer);
                result.Id.ShouldBe(expected.Id);
                result.IsCorrect.ShouldBe(expected.IsCorrect);
                result.Location.ShouldBe(expected.Location);
            }
        }
        
        [Test]
        public void GetQuestionAnswers_WhenQuestionDoesNotExist_ShouldReturnEmptyList()
        {
            var answers = new List<TaskAnswer>()
            {
                new TaskAnswer
                {
                    Id = "id1",
                    IsCorrect = true,
                    Location = "location 1",
                    Answer = "asnwer 1",
                    IsDeleted = false
                },
                new TaskAnswer
                {
                    Id = "id2",
                    IsCorrect = false,
                    Location = "location 2",
                    Answer = "asnwer 2",
                    IsDeleted = false
                }
            };
            taskAnswersRepositoryMock.Setup(s => s.GetAnswersByQuestion("questionId")).Returns(answers);
            var service = new AnswersService(mapper, taskAnswersRepositoryMock.Object);

            var results = service.GetQuestionAnswers("NotExistantId");

            results.ShouldNotBeNull();
            results.Count().ShouldBe(0);
        }
    }
}