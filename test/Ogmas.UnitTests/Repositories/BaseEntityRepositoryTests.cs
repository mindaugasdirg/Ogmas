using System;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;
using Ogmas.Models.Entities;
using Ogmas.Repositories;
using Ogmas.UnitTests.Helpers;
using Shouldly;

namespace Ogmas.UnitTests.Repositories
{
    [TestFixture]
    public class BaseEntityRepositoryTests
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
        public async Task Add_WhenItemIsSupplied_ShouldAddItemToDatabase()
        {
            var item = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var entityRepositoryMock = new Mock<BaseEntityRepository<Game>>(_dbContext);
            entityRepositoryMock.CallBase = true;
            var entityRepository = entityRepositoryMock.Object;

            var added = await entityRepository.Add(item);

            var items = _dbContext.Games.ToList();
            items.Count().ShouldBe(1);
            added.Name.ShouldBe(item.Name);
            added.IsDeleted.ShouldBe(item.IsDeleted);
            added.Ready.ShouldBe(item.Ready);
        }

        [Test]
        public async Task Update_WhenItemIsSupplied_ShouldUpdateItemInDatabase()
        {
            var item = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var entityRepositoryMock = new Mock<BaseEntityRepository<Game>>(_dbContext);
            entityRepositoryMock.CallBase = true;
            var entityRepository = entityRepositoryMock.Object;
            var added = await entityRepository.Add(item);

           added.Name = "updated";

            var updatedResult = await entityRepository.Update(added);

            var items = _dbContext.Games.ToList();
            items.Count().ShouldBe(1);
            updatedResult.Name.ShouldBe("updated");
            updatedResult.IsDeleted.ShouldBe(item.IsDeleted);
            updatedResult.Ready.ShouldBe(item.Ready);
        }

        [Test]
        public async Task Delete_WhenItemIdIsProvided_ShouldDeleteItemFromDatabase()
        {
            var item = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var entityRepositoryMock = new Mock<BaseEntityRepository<Game>>(_dbContext);
            entityRepositoryMock.CallBase = true;
            var entityRepository = entityRepositoryMock.Object;
            var added = await entityRepository.Add(item);

            var deleted = await entityRepository.Delete(added.Id);

            var items = _dbContext.Games.ToList();
            items.Count().ShouldBe(0);
            deleted.Name.ShouldBe(added.Name);
            deleted.IsDeleted.ShouldBe(added.IsDeleted);
            deleted.Ready.ShouldBe(added.Ready);
        }

        [Test]
        public async Task Get_WhenItemExists_ShouldReturnItem()
        {
            var item = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var item2 = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var entityRepositoryMock = new Mock<BaseEntityRepository<Game>>(_dbContext);
            entityRepositoryMock.CallBase = true;
            var entityRepository = entityRepositoryMock.Object;
            var added = await entityRepository.Add(item);
            await entityRepository.Add(item2);

            var found = await entityRepository.Get(added.Id);

            item.Id.ShouldBe(added.Id); 
            item.IsDeleted.ShouldBe(added.IsDeleted); 
            item.Name.ShouldBe(added.Name); 
            item.Ready.ShouldBe(added.Ready); 
        }

        [Test]
        public async Task Get_WhenItemDoesNotExist_ShouldThrowArgumentException()
        {
            var item = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var item2 = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var entityRepositoryMock = new Mock<BaseEntityRepository<Game>>(_dbContext);
            entityRepositoryMock.CallBase = true;
            var entityRepository = entityRepositoryMock.Object;
            var added = await entityRepository.Add(item);
            await entityRepository.Add(item2);

            await Should.ThrowAsync<ArgumentException>(async () => await entityRepository.Get("not existing id"));
        }
        
        [Test]
        public async Task GetAll_WhenCalled_ShouldReturnAllItems()
        {
            var item = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var item2 = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var entityRepositoryMock = new Mock<BaseEntityRepository<Game>>(_dbContext);
            entityRepositoryMock.CallBase = true;
            var entityRepository = entityRepositoryMock.Object;
            var added = await entityRepository.Add(item);
            await entityRepository.Add(item2);

            var found = await entityRepository.GetAll();

            found.Count().ShouldBe(2);
        }
        
        [Test]
        public async Task Filter_WhenCalled_ShouldReturnFilteredItems()
        {
            var item = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var item2 = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = true
            };
            var item3 = new Game()
            {
                Name = "example",
                IsDeleted = false,
                Ready = false
            };
            var entityRepositoryMock = new Mock<BaseEntityRepository<Game>>(_dbContext);
            entityRepositoryMock.CallBase = true;
            var entityRepository = entityRepositoryMock.Object;
            var added = await entityRepository.Add(item);
            await entityRepository.Add(item2);
            await entityRepository.Add(item3);

            var found = entityRepository.Filter(x => x.Ready);

            found.Count().ShouldBe(2);
        }
    }
}