using Microsoft.AspNetCore.Diagnostics;

namespace TaskTracker.Api.Middleware
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
            => this.logger = logger;

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            this.logger.LogError(exception, "Error occured: {Message}", exception.Message);
            this.logger.LogInformation(exception, "Stack trace: {StackTrace}", exception.StackTrace);

            await httpContext.Response
                .WriteAsJsonAsync(new 
                { 
                    Message = "Internal Server Error. Try again later!",
                    Status = 500
                }, cancellationToken);

            return true;
        }
    }
}
