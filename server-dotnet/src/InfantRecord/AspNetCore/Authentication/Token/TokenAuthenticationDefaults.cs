namespace InfantRecord.AspNetCore.Authentication.Token
{
    /// <summary>
    /// Token 认证的默认值。
    /// </summary>
    public static class TokenAuthenticationDefaults
    {
        /// <summary>
        /// 用于 TokenAuthenticationOptions.AuthenticationScheme 的默认值。
        /// </summary>
        public const string AuthenticationScheme = "Token";

        /// <summary>
        /// 用于 TokenAuthenticationOptions.MemoryCacheKeyPrefix 的默认值。
        /// </summary>
        public const string MemoryCacheKeyPrefix = ":auth:tok";

        /// <summary>
        /// 用于 MemoryCacheEntryOptions.SlidingExpiration 的默认值。
        /// </summary>
        public const int MemoryCacheEntrySlidingExpirationSeconds = 86400;
    }
}
