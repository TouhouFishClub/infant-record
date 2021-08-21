using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Filters;

namespace InfantRecord.Contracts.User
{
    /// <summary>
    /// 账号登陆
    /// </summary>
    public class UserPostRequest
    {
        /// <summary>
        /// 用户名
        /// </summary>
        /// <example>buzzers</example>
        [Required]
        public string? Username { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        /// <example>1</example>
        [Required]
        public string? Password { get; set; }
    }

    /// <summary>
    /// 账号登陆
    /// </summary>
    public class UserPostResponse
    {
        /// <summary>
        /// 构造成功响应
        /// </summary>
        public static UserPostResponse Success(string token)
        {
            return new UserPostResponse("ok", token, string.Empty);
        }

        /// <summary>
        /// 构造失败响应
        /// </summary>
        public static UserPostResponse Failed(string msg)
        {
            return new UserPostResponse("err", string.Empty, msg);
        }

        private UserPostResponse(string status, string token, string message)
        {
            this.Status = status ?? throw new ArgumentNullException(nameof(status));
            this.Token = token ?? throw new ArgumentNullException(nameof(token));
            this.Message = message ?? throw new ArgumentNullException(nameof(message));
        }

        /// <summary>
        /// 请求状态
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// 令牌
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        public string Message { get; set; }
    }

    public sealed class UserPostResponseExample : IMultipleExamplesProvider<UserPostResponse>
    {
        IEnumerable<SwaggerExample<UserPostResponse>> IMultipleExamplesProvider<UserPostResponse>.GetExamples()
        {
            yield return new SwaggerExample<UserPostResponse>
            {
                Name = "登陆成功",
                Value = UserPostResponse.Success("a9d1d3bf15affc13a84d4693352ed1b6")
            };
            yield return new SwaggerExample<UserPostResponse>
            {
                Name = "登陆失败",
                Summary = "账号不存在或密码错误",
                Value = UserPostResponse.Failed("账号不存在或密码错误")
            };
        }
    }
}
