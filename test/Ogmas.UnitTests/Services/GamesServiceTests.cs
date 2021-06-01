using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Moq;
using NUnit.Framework;
using Ogmas.Models.Dtos.Create;
using Ogmas.Models.Entities;
using Ogmas.Profiles;
using Ogmas.Repositories.Abstractions;
using Ogmas.Services;
using Shouldly;

namespace Ogmas.UnitTests.Services
{
    [TestFixture]
    public class GamesServiceTests
    {
        private IMapper mapper;
        private Mock<IOrganizedGamesRepository> organizedGamesRepositoryMock;
        private Mock<IGamesRepository> gamesRepositoryMock;
        private Mock<IAuthorizationService> authorizationServiceMock;
        private Mock<IHttpContextAccessor> httpContextAccessorMock;
        
        [SetUp]
        public void Setup()
        {
            organizedGamesRepositoryMock = new Mock<IOrganizedGamesRepository>();
            organizedGamesRepositoryMock.Setup(s => s.Add(It.IsAny<OrganizedGame>())).Returns(Task.FromResult(new OrganizedGame
            {
                Id = "created",
                StartTime = DateTime.Now,
                StartInterval = TimeSpan.FromMinutes(5),
                GameTypeId = "gameId"
            }));
            gamesRepositoryMock = new Mock<IGamesRepository>();
            gamesRepositoryMock.Setup(s => s.Get("gameId")).Returns(new Game
            {
                Id = "gameId",
                CreatedBy = "user",
                Ready = true,
                Name = "test game"
            });
            var mapperConfiguration = new MapperConfiguration(c =>
            {
                c.AddProfile<OrganizedGameProfile>();
            });
            mapper = new Mapper(mapperConfiguration);
            authorizationServiceMock = new Mock<IAuthorizationService>();
            authorizationServiceMock.Setup(s => s.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), It.IsAny<IEnumerable<IAuthorizationRequirement>>()))
                .Returns(Task.FromResult(AuthorizationResult.Success()));
            
            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(s => s.User).Returns(new ClaimsPrincipal());
            httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            httpContextAccessorMock.Setup(s => s.HttpContext).Returns(httpContext.Object);
        }

        [Test]
        public async Task CreateGame_WhenGameTypeExists_ShouldCreateGame()
        {
            var gameService = new GamesService(
                authorizationServiceMock.Object, mapper, organizedGamesRepositoryMock.Object, gamesRepositoryMock.Object, httpContextAccessorMock.Object);

            var result = await gameService.CreateGame("userId", new HostGameOptions()
            {
                StartTime = DateTime.Now.AddHours(1),
                StartInterval = 300,
                GameTypeId = "gameId"
            });

            result.ShouldNotBeNull();
            result.GameTypeId.ShouldBe("gameId");
        }
    }
}