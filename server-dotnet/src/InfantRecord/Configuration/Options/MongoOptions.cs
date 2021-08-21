namespace InfantRecord.Configuration.Options
{
    /// <summary>
    /// Mongo 选项。
    /// </summary>
    public class MongoOptions
    {
        /// <summary>
        /// 连接字符串。
        /// </summary>
        public string ConnectionString { get; set; } = DEFAULT_CONNECTION_STRING;
        public const string DEFAULT_CONNECTION_STRING = "mongodb://host:27017";
    }
}
