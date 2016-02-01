var _ = require('lodash');
var Path = require('path');
var Promise = require('bluebird');
var Constants = require('../config/constants');
var Logger = require('./logger');
var CLI = require('./cli');
var AppMode = require('./appmode');
var Environment = require('../config/environment');
var Resources = require('../config/resources');
var DB = require('../db/db');
var ORM = require('../db/orm');
var MigrationStrategy = require('../db/migration_strategy');
var Server = require('../api/server');
var RoutePrinter = require('./route_printer');
var ProjectGenerator = require('./project_generator');
var REPL = require('./repl');
var Authenticator = require('../api/authenticator');
var ClientManager = require('./client_manager');
var commands = {
    'serve': { description: 'Start the Obsidian server', mode: AppMode.Server },
    'routes': { description: 'Print a list of exposed routes', mode: AppMode.RouteList },
    'new': { description: 'Generate a new project', mode: AppMode.NewProject },
    'repl': { description: 'Start the interactive console', mode: AppMode.REPL },
    'db:alter': { description: 'Migrate the database with the `alter` strategy', mode: AppMode.Migrate },
    'db:create': { description: 'Migrate the database with the `create` strategy', mode: AppMode.Migrate },
    'db:drop': { description: 'Migrate the database with the `drop` strategy', mode: AppMode.Migrate },
    'clients': { description: 'Print a list of authorized clients', mode: AppMode.ManageClients },
    'clients:add': { description: 'Add a new authorized client', mode: AppMode.ManageClients },
    'clients:remove': { description: 'Remove an authorized client', mode: AppMode.ManageClients }
};
var globalOptions = {
    '-r, --resources [path]': 'An optional path to resources.json.  By default, Obsidian searches in the current directory.',
    '-e, --environment [path]': 'An optional path to environment.json.  By default, Obsidian searches in the current directory.'
};
var ObsidianServer = (function () {
    function ObsidianServer() {
        this._cli = new CLI();
        this.configureCLI();
    }
    ObsidianServer.prototype.startServer = function () {
        Logger.info('Starting server...');
        this._server = new Server(this._environment, this._resources, this._orm, this._authenticator);
        return this._server.start();
    };
    ObsidianServer.prototype.printRoutes = function () {
        RoutePrinter.printRoutes(this._environment, this._resources, this._orm);
        return null;
    };
    ObsidianServer.prototype.startREPL = function () {
        var repl = new REPL(this._orm);
        return repl.run();
    };
    ObsidianServer.prototype.manageClients = function () {
        if (this._cli.command == 'clients') {
            return ClientManager.list(this._authenticator);
        }
        else if (this._cli.command == 'clients:add') {
            return ClientManager.create(this._authenticator);
        }
        else if (this._cli.command == 'clients:remove') {
            return ClientManager.destroy(this._authenticator);
        }
    };
    ObsidianServer.prototype.loadORM = function () {
        return this.initializeORM();
    };
    ObsidianServer.prototype.migrateORM = function () {
        var command = this._cli.command;
        var strategyMap = {
            'db:alter': MigrationStrategy.Alter,
            'db:create': MigrationStrategy.Create,
            'db:drop': MigrationStrategy.Drop
        };
        var strategy = strategyMap[command];
        var rawCommand = command.replace('db:', '');
        Logger.info('Migrating database with the `' + rawCommand + '` strategy...');
        return this.initializeORM(strategy);
    };
    ObsidianServer.prototype.initializeORM = function (strategy) {
        if (strategy === void 0) { strategy = MigrationStrategy.Safe; }
        var self = this;
        return DB.load(this._environment).then(function (adapters) {
            var orm = new ORM(self._resources.resources, adapters, strategy);
            self._orm = orm;
            self.postLoad();
            return orm.connect();
        });
    };
    ObsidianServer.prototype.loadResources = function (path) {
        return new Promise(function (resolve, reject) {
            Logger.info('Loading resources...');
            var resources = new Resources(path);
            resources.load(function (error) {
                if (error)
                    reject(error);
                else
                    resolve(resources);
            });
        });
    };
    ObsidianServer.prototype.loadEnvironment = function (path) {
        return new Promise(function (resolve, reject) {
            Logger.info('Loading environment...');
            var environment = new Environment(path);
            environment.load(function (error) {
                if (error)
                    reject(error);
                else
                    resolve(environment);
            });
        });
    };
    ObsidianServer.prototype.preFlight = function () {
        this._authenticator = new Authenticator();
        this._resources.addResource(this._authenticator.resource);
    };
    ObsidianServer.prototype.postLoad = function () {
        this._authenticator.orm = this._orm;
    };
    ObsidianServer.prototype.loadConfiguration = function () {
        var self = this;
        var paths = {
            environment: this._cli.options['environment'] || ObsidianServer.getAbsolutePath('environment.json'),
            resources: this._cli.options['resources'] || ObsidianServer.getAbsolutePath('resources.json')
        };
        var promises = {
            environment: this.loadEnvironment(paths.environment),
            resources: this.loadResources(paths.resources)
        };
        return new Promise(function (fulfill, reject) {
            Promise.props(promises).then(function (results) {
                self._environment = results['environment'];
                self._resources = results['resources'];
                self.preFlight();
                fulfill(undefined);
            }).catch(reject);
        });
    };
    ObsidianServer.prototype.runMode = function (mode) {
        var self = this;
        Logger.hello();
        Logger.info('Obsidian Server version', Constants.version);
        var promise;
        switch (mode) {
            case AppMode.Server: {
                promise = this.loadConfiguration().bind(this).then(this.loadORM).then(this.startServer);
                break;
            }
            case AppMode.RouteList: {
                promise = this.loadConfiguration().bind(this).then(this.loadORM).then(this.printRoutes).then(this.teardownPromise);
                break;
            }
            case AppMode.NewProject: {
                promise = ProjectGenerator.generate().bind(this).then(this.teardownPromise);
                break;
            }
            case AppMode.REPL: {
                promise = this.loadConfiguration().bind(this).then(this.loadORM).then(this.startREPL).then(this.teardownPromise);
                break;
            }
            case AppMode.Migrate: {
                promise = this.loadConfiguration().bind(this).then(this.migrateORM).then(this.teardownPromise);
                break;
            }
            case AppMode.ManageClients: {
                promise = this.loadConfiguration().bind(this).then(this.loadORM).then(this.manageClients).then(this.teardownPromise);
                break;
            }
        }
        promise.catch(this.catchError);
    };
    ObsidianServer.prototype.catchError = function (error) {
        Logger.error(error, 'An unexpected error occurred');
        console.error(error);
        this.teardown(-1);
    };
    ObsidianServer.prototype.teardownPromise = function () {
        var self = this;
        return new Promise(function (fulfill, reject) {
            fulfill(self.teardown());
        });
    };
    ObsidianServer.prototype.teardown = function (exitCode) {
        if (exitCode === void 0) { exitCode = 0; }
        var self = this;
        var promises = [];
        if (this._orm) {
            promises.push(this._orm.disconnect());
        }
        if (this._server) {
            promises.push(this._server.stop());
        }
        Promise.all(promises).finally(function () {
            if (exitCode == 0) {
                Logger.goodbye();
            }
            process.exit(exitCode);
        });
    };
    ObsidianServer.prototype.configureCLI = function () {
        var self = this;
        Logger.start();
        _.each(globalOptions, function (description, option) {
            self._cli.addOption(option, description);
        });
        _.each(commands, function (command, name) {
            self._cli.addCommand(name, command.description, self.runMode.bind(self, command.mode));
        });
        this.registerInterruptHandler();
    };
    ObsidianServer.prototype.registerInterruptHandler = function () {
        var self = this;
        process.on('SIGINT', function () {
            Logger.info('Shutting down in response to interrupt signal...', null, false, true);
            self.teardown();
        });
    };
    ObsidianServer.prototype.run = function () {
        this._cli.run(process.argv);
    };
    ObsidianServer.getAbsolutePath = function (filename) {
        return Path.join(process.cwd(), filename);
    };
    return ObsidianServer;
})();
module.exports = ObsidianServer;
//# sourceMappingURL=obsidian.js.map