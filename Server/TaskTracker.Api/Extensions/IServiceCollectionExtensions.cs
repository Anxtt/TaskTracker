﻿using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;

using Microsoft.EntityFrameworkCore;

using Microsoft.IdentityModel.Tokens;

using AspNetCoreRateLimit;

using TaskTracker.Api.Services;
using TaskTracker.Api.Services.Contracts;

using TaskTracker.Core.Services;
using TaskTracker.Core.Services.Contracts;

using TaskTracker.Data;
using TaskTracker.Data.Models;

using static TaskTracker.Api.Extensions.AspNetCoreRateLimitExtensions;

namespace TaskTracker.Api.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddAppDbContext(this IServiceCollection services, IConfiguration config)
        {
            string connectionString = config.GetConnectionString("DefaultConnection");

            services.AddDbContext<TaskTrackerDbContext>(options =>
                options.UseSqlServer(connectionString));

            return services;
        }

        public static IServiceCollection AddIdentityWithJWT(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 6;
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<TaskTrackerDbContext>();

            services.Configure<AppSettings>(
                config.GetSection(nameof(AppSettings)),
                options => options.BindNonPublicProperties = true);

            string secret = config
                .GetSection(nameof(AppSettings))
                .GetValue<string>(nameof(AppSettings.Secret));

            byte[] key = Encoding.ASCII.GetBytes(secret);

            services
                .AddAuthentication(auth =>
                {
                    auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(bearer =>
                {
                    bearer.RequireHttpsMetadata = false;
                    bearer.SaveToken = true;
                    bearer.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key)
                    };

                    bearer.Events = new JwtBearerEvents()
                    {
                        OnMessageReceived = ctx =>
                        {
                            HttpRequest request = ctx.HttpContext.Request;
                            IRequestCookieCollection cookies = request.Cookies;

                            if (cookies.TryGetValue(".AspNetCore.Application.Verified", out string token))
                            {
                                ctx.Token = token;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            return services;
        }

        public static IServiceCollection AddClientRateLimiting(this IServiceCollection services, IConfiguration config)
        {
            services.AddOptions();

            services.Configure<ClientRateLimitOptions>(config.GetSection("ClientRateLimiting"));

            services.Configure<ClientRateLimitPolicies>(config.GetSection("ClientRateLimitPolicies"));

            services.AddInMemoryRateLimiting();

            services.AddSingleton<IRateLimitConfiguration, CustomRateLimitConfiguration>();

            return services;
        }

        public static IServiceCollection AddIpRateLimiting(this IServiceCollection services, IConfiguration config)
        {
            services.AddOptions();

            services.Configure<IpRateLimitOptions>(config.GetSection("IpRateLimiting"));

            services.Configure<IpRateLimitPolicies>(config.GetSection("IpRateLimitPolicies"));

            services.AddInMemoryRateLimiting();

            services.AddSingleton<IRateLimitConfiguration, CustomRateLimitConfiguration>();

            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IChoreService, ChoreService>();
            services.AddScoped<IIdentityService, IdentityService>();
            services.AddScoped<IJwtService, JwtService>();

            return services;
        }
    }
}
