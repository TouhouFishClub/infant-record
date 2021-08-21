using System;
using System.IO;
using InfantRecord.Configuration.Options;
using InfantRecord.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Core;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Exceptions.Core;

namespace InfantRecord.Logging
{
    public static class SerilogLoggerFactory
    {
        /// <summary>
        /// 日志异常信息属性名
        /// </summary>
        public static string ExceptionDetailsPropertyName => "ExceptionDetails";

        /// <summary>
        /// 创建默认日志记录器
        /// </summary>
        public static Logger CreateDefaultLogger()
            => CreateDefaultLoggerConfiguration().CreateLogger();

        /// <summary>
        /// 创建日志记录器
        /// </summary>
        public static Logger CreateLogger()
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile($"appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{EnvironmentExtensions.EnvironmentName}.json", optional: true, reloadOnChange: true)
                .Build();
            var options = configuration
                .GetSection("Serilog")
                .Get<SerilogOptions>();
            var logger = CreateDefaultLoggerConfiguration()
                .MinimumLevel.Is(Enum.Parse<LogEventLevel>(options.MinimumLevel));
            if (options.Override is not null)
            {
                foreach (var (source, minimumLevel) in options.Override)
                {
                    logger = logger.MinimumLevel.Override(source, Enum.Parse<LogEventLevel>(minimumLevel));
                }
            }
            return logger.CreateLogger();
        }

        private static LoggerConfiguration CreateDefaultLoggerConfiguration()
        {
            var destructuringOptions = new DestructuringOptionsBuilder()
                .WithDefaultDestructurers()
                .WithRootName(ExceptionDetailsPropertyName);
            var configuration = new LoggerConfiguration()
                .MinimumLevel.Is(EnvironmentExtensions.EnvironmentName.Equals(Environments.Development, StringComparison.OrdinalIgnoreCase) ? LogEventLevel.Debug : LogEventLevel.Information)
                .Enrich.FromLogContext()
                .Enrich.WithExceptionDetails(destructuringOptions);
            return configuration
                .WriteTo.Console();
        }
    }
}
