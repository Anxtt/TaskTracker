using Microsoft.AspNetCore.Mvc;

namespace TaskTracker.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public abstract class ApiController : ControllerBase
    {
    }
}
