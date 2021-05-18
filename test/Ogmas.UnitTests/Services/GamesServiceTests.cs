using AutoMapper;
using Moq;
using NUnit.Framework;
using Ogmas.Profiles;
using Ogmas.Repositories.Abstractions;

namespace Ogmas.UnitTests.Services
{
    [TestFixture]
    public class GamesServiceTests
    {
        private IMapper mapper;
        private Mock<IOrganizedGamesRepository> organizedGamesRepositoryMock;
        private Mock<IGamesRepository> gamesRepositoryMock;
        
        [SetUp]
        public void Setup()
        {
            organizedGamesRepositoryMock = new Mock<IOrganizedGamesRepository>();
            gamesRepositoryMock = new Mock<IGamesRepository>();
            var mapperConfiguration = new MapperConfiguration(c =>
            {
                c.AddProfile<OrganizedGameProfile>();
            });
            mapper = new Mapper(mapperConfiguration);
        }

        [Test]
        public void CreateGame_WhenGameTypeExists_ShouldCreateGame()
        {
            
        }
    }
}