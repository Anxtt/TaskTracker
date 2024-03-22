using AspNetCoreRateLimit;
using Microsoft.Extensions.Options;

namespace TaskTracker.Api.Extensions
{
    public class AspNetCoreRateLimitExtensions
    {
        public class CustomRateLimitConfiguration : RateLimitConfiguration
        {
            public CustomRateLimitConfiguration(
                IOptions<IpRateLimitOptions> ipOptions,
                IOptions<ClientRateLimitOptions> clientOptions)
                : base(ipOptions, clientOptions)
            {
            }

            public override ICounterKeyBuilder EndpointCounterKeyBuilder { get; } = new EndpointCounterKeyBuilder();
        }

        public class EndpointCounterKeyBuilder : ICounterKeyBuilder
        {
            public string Build(ClientRequestIdentity requestIdentity, RateLimitRule rule)
                => $"_{rule.Endpoint}";
        }
    }
}
