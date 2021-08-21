using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Net.Http.Headers;

namespace InfantRecord.AspNetCore.Authentication.Token
{
    /// <summary>
    /// 选项类提供控制 Token 认证处理程序行为所需的信息。
    /// </summary>
    public class TokenAuthenticationOptions : AuthenticationSchemeOptions
    {
        /// <summary>
        /// 令牌 Http 消息头。
        /// </summary>
        public string TokenHeaderName { get; set; } = HeaderNames.Authorization;

        /// <summary>
        /// 内存缓存键前缀。
        /// </summary>
        public string MemoryCacheKeyPrefix { get; set; } = TokenAuthenticationDefaults.MemoryCacheKeyPrefix;

        /// <summary>
        /// 内存缓存项选项。
        /// </summary>
        public MemoryCacheEntryOptions? MemoryCacheEntryOptions { get; set; }
    }
}
