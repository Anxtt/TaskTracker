namespace TaskTracker.Api.Middleware
{
    public class LoginRequiredMiddleware
    {
        private readonly RequestDelegate next;

        public LoginRequiredMiddleware(RequestDelegate next)
            => this.next = next;
    
        public async Task Invoke(HttpContext context)
        {
            string verifiedCookie = context.Request.Cookies[".AspNetCore.Application.Verified"]!;
            string cookie = context.Request.Cookies[".AspNetCore.Application.Cookie"]!;

            if (verifiedCookie == null && cookie == null)
            {
                if (context.Request.Path != "/api/Identity/Login")
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
            }

            await next(context);
        }
    }
}
