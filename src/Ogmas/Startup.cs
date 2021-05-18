using System;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Ogmas.Exceptions;
using Ogmas.Models.Entities;
using Ogmas.Repositories;
using Ogmas.Repositories.Abstractions;
using Ogmas.Services;
using Ogmas.Services.Abstractions;

namespace Ogmas
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = Configuration.GetValue<string>("POSTGRESQLCONNSTR_DbConntectionString");
            if(string.IsNullOrWhiteSpace(connectionString))
            {
                connectionString = Configuration.GetConnectionString("POSTGRESQLCONNSTR_DbConntectionString");
            }
            services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(connectionString));

            // repositories
            services.AddTransient<IGameParticipantsRepository, GameParticipantsRepository>();
            services.AddTransient<IGamesRepository, GamesRepository>();
            services.AddTransient<IGameTasksRepository, GameTasksRepository>();
            services.AddTransient<IOrganizedGamesRepository, OrganizedGamesRepository>();
            services.AddTransient<ISubmitedAnswersRepository, SubmitedAnswersRepository>();
            services.AddTransient<ITaskAnswersRepository, TaskAnswersRepository>();
            services.AddTransient<IUserRepository, UserRepository>();

            // services
            services.AddAutoMapper(typeof(Startup));
            services.AddTransient<IGameTypesService, GameTypesService>();
            services.AddTransient<IGameTasksService, GameTasksService>();
            services.AddTransient<IAnswersService, AnswersService>();
            services.AddTransient<IGamesService, GamesService>();
            services.AddTransient<IPlayersService, PlayersService>();

            services.AddRazorPages();

            services.AddDefaultIdentity<User>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 0;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
            }).AddEntityFrameworkStores<DatabaseContext>();
            services.AddIdentityServer().AddApiAuthorization<User, DatabaseContext>();
            services.AddAuthentication().AddIdentityServerJwt();

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "client-app/build";
            });

            ApplyMigrations(services.BuildServiceProvider());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseExceptionHandler(app => app.Run(ErrorHandler.HandleError));

            if (!env.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "client-app";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        private void ApplyMigrations(IServiceProvider services)
        {
            using (var scope = services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
                db.Database.Migrate();
            }
        }
    }
}
