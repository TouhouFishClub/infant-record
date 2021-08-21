using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace InfantRecord.AspNetCore.Authentication.Token
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Maintainability", "CA1812:Avoid uninstantiated internal classes", Justification = "<挂起>")]
    internal class TokenAuthenticationHandler : AuthenticationHandler<TokenAuthenticationOptions>
    {
        public TokenAuthenticationHandler(
            IOptionsMonitor<TokenAuthenticationOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Maintainability", "CA1508:避免死条件代码", Justification = "<挂起>")]
        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            string token = this.Request.Headers[this.Options.TokenHeaderName];
            if (string.IsNullOrWhiteSpace(token))
            {
                return AuthenticateResult.NoResult();
            }

            if (token.StartsWith("Token ", StringComparison.OrdinalIgnoreCase))
            {
                token = token["Token ".Length..].Trim();
            }
            if (string.IsNullOrEmpty(token))
            {
                return AuthenticateResult.NoResult();
            }

            var cache = this.Request.HttpContext.RequestServices.GetRequiredService<IMemoryCache>();
            var cacheKey = $"{this.Options.MemoryCacheKeyPrefix}:{token}";
            var nameIdentifier = cache.Get<string>(cacheKey);
            var isCacheHit = !string.IsNullOrWhiteSpace(nameIdentifier);
            if (!isCacheHit)
            {
                var mongo = this.Request.HttpContext.RequestServices.GetRequiredService<MongoClient>();
                var cursor = await mongo
                    .GetDatabase("db_baby")
                    .GetCollection<BsonDocument>("cl_user")
                    .FindAsync(BuildFilterByToken(token), new FindOptions<BsonDocument> { Limit = 1 }, this.Request.HttpContext.RequestAborted);
                var entity = await cursor.FirstOrDefaultAsync(this.Request.HttpContext.RequestAborted);
                if (entity is null ||
                    !entity.TryGetValue("username", out var username) ||
                    username is null ||
                    username.BsonType != BsonType.String)
                {
                    return AuthenticateResult.NoResult();
                }

                nameIdentifier = username.AsString;
            }

            if (!isCacheHit)
            {
                _ = cache.Set(cacheKey, nameIdentifier, this.Options.MemoryCacheEntryOptions);
            }

            return AuthenticateResult.Success(this.CreateAuthenticationTicket(nameIdentifier));

            static BsonDocument BuildFilterByToken(string token)
            {
                return new BsonDocument(new Dictionary<string, object>
                {
                    {"token" , token }
                });
            }
        }

        private AuthenticationTicket CreateAuthenticationTicket(string nameIdentifier)
        {
            var claims = new Claim[] { new Claim(ClaimTypes.NameIdentifier, nameIdentifier) };
            var identity = new ClaimsIdentity(claims, this.Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            return new AuthenticationTicket(principal, this.Scheme.Name);
        }
    }
}
