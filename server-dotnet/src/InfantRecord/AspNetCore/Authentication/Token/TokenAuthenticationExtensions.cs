using System;
using InfantRecord.AspNetCore.Authentication.Token;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class TokenAuthenticationExtensions
    {
        public static AuthenticationBuilder? AddToken(this AuthenticationBuilder builder)
            => builder.AddToken(TokenAuthenticationDefaults.AuthenticationScheme, options => { });

        public static AuthenticationBuilder? AddToken(this AuthenticationBuilder builder, Action<TokenAuthenticationOptions> configureOptions)
            => builder.AddToken(TokenAuthenticationDefaults.AuthenticationScheme, configureOptions);

        public static AuthenticationBuilder? AddToken(this AuthenticationBuilder builder, string authenticationScheme, Action<TokenAuthenticationOptions> configureOptions)
            => builder.AddToken(authenticationScheme, displayName: string.Empty, configureOptions: configureOptions);

        public static AuthenticationBuilder? AddToken(this AuthenticationBuilder builder, string authenticationScheme, string displayName, Action<TokenAuthenticationOptions> configureOptions)
        {
            if (builder is not null)
            {
                builder.Services.TryAddEnumerable(ServiceDescriptor.Singleton<IPostConfigureOptions<TokenAuthenticationOptions>, PostConfigureTokenAuthenticationOptions>());
                _ = builder.AddScheme<TokenAuthenticationOptions, TokenAuthenticationHandler>(authenticationScheme, displayName, configureOptions);
            }
            return builder;
        }
    }
}
