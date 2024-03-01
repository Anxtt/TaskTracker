namespace TaskTracker.Api.Middleware
{
    public class LoginRequiredMiddleware : IMiddleware
    {
        //private readonly RequestDelegate next;

        //public LoginRequiredMiddleware(RequestDelegate next)
        //    => this.next = next;

        //public async Task Invoke(HttpContext context)
        //{

        //}

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            if (context.Response.StatusCode == StatusCodes.Status401Unauthorized)
            {
                //sort of works for now
                //gotta find a better way/improve this one to do this
                //implement log out and remove jwt cookie as a starter(?)

                //return 405 Not Allowed
                //see how/what you can do with that

                //redirect for log out needed
                context.Response.Redirect("/api/Identity/Login");
                return;
            }

            await next(context);
        }
    }
}
