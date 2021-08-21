using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using InfantRecord.AspNetCore.Authentication.Token;
using InfantRecord.Contracts.User;
using InfantRecord.Conventions;
using InfantRecord.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace InfantRecord.Controllers
{
    [ApiController]
    [Authorize(AuthenticationSchemes = TokenAuthenticationDefaults.AuthenticationScheme)]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces(MediaTypeNames.Application.Json)]
    [Route("api/[controller]")]
    [RESTfulControllerName]
    public class UserController : ControllerBase
    {
        private readonly MongoClient mongo;

        public UserController(MongoClient mongo)
        {
            this.mongo = mongo ?? throw new ArgumentNullException(nameof(mongo));
        }

        /// <summary>
        /// 登录
        /// </summary>
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<UserPostResponse>> PostAsync([FromBody] UserPostRequest request)
        {
            if (request is null ||
                string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return new BadRequestResult();
            }

            var cursor = await this.mongo
                .GetDatabase("db_baby")
                .GetCollection<BsonDocument>("cl_user")
                .FindAsync(BuildFilterByUsernamePassword(request.Username, request.Password), new FindOptions<BsonDocument> { Limit = 1 }, this.HttpContext.RequestAborted);
            var entity = await cursor.FirstOrDefaultAsync(this.HttpContext.RequestAborted);
            if (entity is null ||
                !entity.TryGetValue("token", out var token) ||
                token is null ||
                token.BsonType != BsonType.String)
            {
                return UserPostResponse.Failed("账号不存在或密码错误");
            }

            return UserPostResponse.Success(token.AsString);
        }

        private static BsonDocument BuildFilterByUsernamePassword(string username, string password)
        {
            return new BsonDocument(new Dictionary<string, object>
            {
                { "username", username},
                { "password", password.ToSHA256()},
            });
        }
    }
}
