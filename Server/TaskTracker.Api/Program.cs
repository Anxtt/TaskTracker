using TaskTracker.Api.Extensions;
using TaskTracker.Api.Middleware;

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
               //.UseMiddleware<LoginRequiredMiddleware>()
               .UseEndpoints(endpoints => endpoints
                    .MapControllers());

            app.Run();
        }
    }
}