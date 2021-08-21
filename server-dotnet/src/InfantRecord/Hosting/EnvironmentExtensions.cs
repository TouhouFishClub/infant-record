using System;
using Microsoft.Extensions.Hosting;

namespace InfantRecord.Hosting
{
    /// <summary>
    /// 环境扩展方法
    /// </summary>
    public static class EnvironmentExtensions
    {
        /// <summary>
        /// 获取环境名称，如果未设置则默认为 <seealso cref="Environments.Production"/>。
        /// </summary>
        public static string EnvironmentName
        {
            get
            {
                var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                if (string.IsNullOrWhiteSpace(environmentName))
                {
                    environmentName = Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT");
                }
                return environmentName ?? Environments.Production;
            }
        }
    }
}
