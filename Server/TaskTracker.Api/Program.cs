using TaskTracker.Api.Extensions;

namespace TaskTracker.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder
                .Services
                    .AddAppDbContext(builder.Configuration)
                    .AddControllers()
                .Services
                    .AddEndpointsApiExplorer()
                    .AddSwaggerGen()
                    .AddServices()
                    .AddIdentityWithJWT(builder.Configuration)
                    .AddAuthorization()
                    .AddCors(options =>
                    {
                        options.AddDefaultPolicy(opt =>
                        {
                            opt
                            .WithOrigins("http://localhost:3000")
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials();
                        });
                    });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger()
                   .UseSwaggerUI();
            }

            app
               .UseHttpsRedirection()
               .UseRouting()
               .UseCors()
               .UseHttpsRedirection()
               .UseAuthentication()
               .UseAuthorization()
               .Use(async (context, next) =>
               {
                   string verifiedCookie = context.Request.Cookies[".AspNetCore.Application.Verified"]!;
                   string cookie = context.Request.Cookies[".AspNetCore.Application.Cookie"]!;

                   if (verifiedCookie != null)
                   {
                       if (cookie != null)
                       {
                           if (cookie != "true" && context.Request.Path != "/api/Identity/Login")
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
                   }

                   await next(context);
               })
               .UseEndpoints(endpoints => endpoints
                    .MapControllers());

            app.Run();
        }
    }
}