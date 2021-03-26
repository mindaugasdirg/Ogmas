using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ogmas.Services.Abstractions;

namespace Ogmas.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/questions/{questionId}/answers")]
    public class QuestionAnswersController : ControllerBase
    {
        private readonly IAnswersService answersService;

        public QuestionAnswersController(IAnswersService _answersService)
        {
            answersService = _answersService;
        }

        [HttpGet]
        public IActionResult GetAnswers(string questionId)
        {
            var answers = answersService.GetQuestionAnswers(questionId);
            return Ok(answers);
        }
    }
}