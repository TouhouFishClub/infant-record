using System.Collections.Generic;

namespace InfantRecord.Configuration.Options
{
    /// <summary>
    /// 日志选项。
    /// </summary>
    public class SerilogOptions
    {
        /// <summary>
        /// 日志等级。
        /// </summary>
        public string MinimumLevel { get; set; } = DEFAULT_MINIMUM_LEVEL;
        public const string DEFAULT_MINIMUM_LEVEL = "Information";

        /// <summary>
        /// 重载指定的类型的日志等级。
        /// </summary>
        public Dictionary<string, string>? Override { get; set; }
    }
}
