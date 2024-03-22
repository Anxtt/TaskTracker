using AspNetCoreRateLimit;

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
                    .AddMemoryCache()
                    .AddServices()
                    .AddIpRateLimiting(builder.Configuration)
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

            app.UseIpRateLimiting();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger()
                   .UseSwaggerUI();
            }

            app
               .UseHttpsRedirection()
               .UseRouting()
               .UseCors()
               .UseAuthentication()
               .UseAuthorization()
               .UseEndpoints(endpoints => endpoints
                    .MapControllers());

            app.Run();
        }
    }
}