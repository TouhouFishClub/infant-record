using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace InfantRecord.Utils
{
    public static class StringHelper
    {
        /// <summary>
        /// 返回 <paramref name="value"/> 的 SHA256 散列字符串表示
        /// </summary>
        public static string ToSHA256(this string value)
        {
            if (value is null)
            {
                throw new ArgumentNullException(nameof(value));
            }
            if (string.IsNullOrWhiteSpace(value))
            {
                return string.Empty;
            }

            using var hash = SHA256.Create();
            return hash.ComputeHash(Encoding.UTF8.GetBytes(value)).Select(x => x.ToString("x2")).Aggregate((sum, x) => sum + x);
        }
    }
}
