using System;
using System.Diagnostics;
using InfantRecord.AspNetCore.Authentication.Token;
using InfantRecord.Configuration.Options;
using InfantRecord.Conventions;
using InfantRecord.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using Prometheus;
using Serilog;
using Swashbuckle.AspNetCore.Filters;

namespace InfantRecord
{
    public static class Program
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1031:不捕获常规异常类型", Justification = "<挂起>")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0058:永远不会使用表达式值", Justification = "<挂起>")]
        public static void Main(string[] args)
        {
            Activity.DefaultIdFormat = ActivityIdFormat.W3C;

            Log.Logger = SerilogLoggerFactory.CreateDefaultLogger();

            try
            {
                Log.Logger = SerilogLoggerFactory.CreateLogger();
                var builder = Host.CreateDefaultBuilder(args)
                    .ConfigureLogging(builder => builder.ClearProviders().AddSerilog())
                    .ConfigureServices((context, services) =>
                    {
                        var configuration = context.Configuration;

                        services
                            .AddOptions()
                            .Configure<MongoOptions>(configuration.GetSection("Mongo"));

                        services
                            .AddSingleton(services => new MongoClient(services.GetRequiredService<IOptions<MongoOptions>>().Value.ConnectionString));
                    })
                    .ConfigureWebHostDefaults(builder =>
                    {
                        builder
                            .ConfigureServices((context, services) =>
                            {
                                services.AddAuthentication().AddToken();
                                services.AddControllers().AddRESTfulControllerNameConvention();
                                services.AddHealthChecks();
                                services.AddSpaStaticFiles(configuration =>
                                {
                                    configuration.RootPath = "ClientApp/dist";
                                });
                                services.AddSwaggerExamplesFromAssemblies(typeof(Program).Assembly);
                                services.AddSwaggerGen(options =>
                                {
                                    options.AddSecurityDefinition(TokenAuthenticationDefaults.AuthenticationScheme, new OpenApiSecurityScheme
                                    {
                                        Type = SecuritySchemeType.ApiKey,
                                        Name = "Authorization",
                                        In = ParameterLocation.Header,
                                        Scheme = TokenAuthenticationDefaults.AuthenticationScheme,
                                    });
                                    options.ExampleFilters();
                                    options.IncludeXmlComments("InfantRecord.xml", true);
                                    options.OperationFilter<SecurityRequirementsOperationFilter>(true, TokenAuthenticationDefaults.AuthenticationScheme);
                                    options.SwaggerDoc("v1", new OpenApiInfo { Title = "InfantRecord", Version = "v1" });
                                    options.UseOneOfForPolymorphism();
                                });
                            })
                            .Configure((context, app) =>
                            {
                                var env = context.HostingEnvironment;

                                if (env.IsDevelopment())
                                {
                                    app.UseDeveloperExceptionPage();
                                    app.UseSwagger();
                                    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "InfantRecord v1"));
                                }

                                app.UseStaticFiles();
                                if (!env.IsDevelopment())
                                {
                                    app.UseSpaStaticFiles();
                                }

                                app.UseRouting();
                                app.UseHttpMetrics();
                                app.UseAuthentication();
                                app.UseAuthorization();

                                app.UseEndpoints(endpoints =>
                                {
                                    endpoints.MapHealthChecks("/healthz");
                                    endpoints.MapMetrics();
                                    endpoints.MapControllers();
                                });
                                app.UseSpa(spa =>
                                {
                                    spa.Options.SourcePath = "ClientApp";

                                    if (env.IsDevelopment())
                                    {
                                        spa.UseProxyToSpaDevelopmentServer(baseUri: "http://localhost:8080");
                                    }
                                });
                            })
                            .UseSerilog();
                    });
                var host = builder
                    .UseConsoleLifetime()
                    .Build();
                host.Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
    }
}
