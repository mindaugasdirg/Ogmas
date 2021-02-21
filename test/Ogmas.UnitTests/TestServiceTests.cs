using NUnit.Framework;
using Ogmas.Services;
using Shouldly;

namespace Ogmas.UnitTests
{
    public class TestServiceTests
    {
        [Test]
        public void TestMethod_WhenCalled_ShouldReturnResult()
        {
            var testService = new TestService();

            var result = testService.TestMethod();

            result.ShouldBe("TestResult");
        }
    }
}
