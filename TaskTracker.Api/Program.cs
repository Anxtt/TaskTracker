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
                        options.AddPolicy("all", opt =>
                        {
                            opt.AllowAnyOrigin();
                            opt.AllowAnyMethod();
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
               .UseCors(x => x
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader())
               .UseHttpsRedirection()
               .UseAuthentication()
               .UseAuthorization()
               .UseEndpoints(endpoints => endpoints
                    .MapControllers());

            app.Run();
        }
    }
}