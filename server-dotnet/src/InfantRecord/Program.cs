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

                        _ = services
                            .AddOptions()
                            .Configure<MongoOptions>(configuration.GetSection("Mongo"));

                        _ = services
                            .AddSingleton(services => new MongoClient(services.GetRequiredService<IOptions<MongoOptions>>().Value.ConnectionString));
                    })
                    .ConfigureWebHostDefaults(builder =>
                    {
                        _ = builder
                            .ConfigureServices((context, services) =>
                            {
                                _ = services.AddAuthentication().AddToken();
                                _ = services.AddControllers().AddRESTfulControllerNameConvention();
                                _ = services.AddHealthChecks();
                                services.AddSpaStaticFiles(configuration =>
                                {
                                    configuration.RootPath = "ClientApp/dist";
                                });
                                _ = services.AddSwaggerExamplesFromAssemblies(typeof(Program).Assembly);
                                _ = services.AddSwaggerGen(options =>
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
                                    _ = app.UseDeveloperExceptionPage();
                                    _ = app.UseSwagger();
                                    _ = app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "InfantRecord v1"));
                                }

                                _ = app.UseStaticFiles();
                                if (!env.IsDevelopment())
                                {
                                    app.UseSpaStaticFiles();
                                }

                                _ = app.UseRouting();
                                _ = app.UseHttpMetrics();
                                _ = app.UseAuthentication();
                                _ = app.UseAuthorization();

                                _ = app.UseEndpoints(endpoints =>
                                {
                                    _ = endpoints.MapHealthChecks("/healthz");
                                    _ = endpoints.MapMetrics();
                                    _ = endpoints.MapControllers();
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
