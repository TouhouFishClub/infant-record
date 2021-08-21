using System;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.Extensions.DependencyInjection;

namespace InfantRecord.Conventions
{
    /// <summary>
    /// RESTful-style 控制器名称
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class RESTfulControllerNameAttribute : Attribute
    {
    }

    /// <summary>
    /// RESTful-style 控制器名称约定
    /// </summary>
    public class RESTfulControllerNameConvention : IControllerModelConvention
    {
        /// <inheritdoc/>
        public void Apply(ControllerModel controller)
        {
            if (controller is not null && controller.Attributes.OfType<RESTfulControllerNameAttribute>().Any())
            {
                controller.ControllerName = Regex.Replace(controller.ControllerName, "([A-Z])", "-$0", RegexOptions.Compiled).TrimStart('-').ToLower();
            }
        }
    }

    /// <summary>
    /// RESTful-style 控制器名称约定扩展
    /// </summary>
    public static class RESTfulControllerNameConventionExtensions
    {
        /// <summary>
        /// 配置 RESTful-style 控制器名称约定
        /// </summary>
        public static IMvcBuilder AddRESTfulControllerNameConvention(this IMvcBuilder builder)
            => builder.AddMvcOptions(options => options.Conventions.Add(new RESTfulControllerNameConvention()));
    }
}
