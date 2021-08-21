using System;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace InfantRecord.AspNetCore.Authentication.Token
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Maintainability", "CA1812:Avoid uninstantiated internal classes", Justification = "<挂起>")]
    internal class PostConfigureTokenAuthenticationOptions : IPostConfigureOptions<TokenAuthenticationOptions>
    {
        public void PostConfigure(string name, TokenAuthenticationOptions options)
        {
            if (options.MemoryCacheEntryOptions is null)
            {
                options.MemoryCacheEntryOptions = new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromSeconds(TokenAuthenticationDefaults.MemoryCacheEntrySlidingExpirationSeconds)
                };
            }
        }
    }
}
