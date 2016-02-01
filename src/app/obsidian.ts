/**
 * Obsidian Server
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

import _ = require('lodash');
import Path = require('path');
import Async = require('async');
import Promise = require('bluebird');

import Constants = require('../config/constants');
import Logger = require('./logger');
import CLI = require('./cli');
import AppMode = require('./appmode');
import Configuration = require('../config/configuration');
import Environment = require('../config/environment');
import Resources = require('../config/resources');
import DB = require('../db/db');
import ORM = require('../db/orm');
import MigrationStrategy = require('../db/migration_strategy');
import Server = require('../api/server');
import RoutePrinter = require('./route_printer');
import ProjectGenerator = require('./project_generator');
import REPL = require('./repl');
import Authenticator = require('../api/authenticator');
import ClientManager = require('./client_manager');

interface Command {
    description: string,
    mode: AppMode
}

// TODO: Put these names in a common place so they can be checked against without using string literals.
let commands: Dictionary<Command> = {
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

let globalOptions: Dictionary<string> = {
    '-r, --resources [path]': 'An optional path to resources.json.  By default, Obsidian searches in the current directory.',
    '-e, --environment [path]': 'An optional path to environment.json.  By default, Obsidian searches in the current directory.'
};

class ObsidianServer {

    // Private Members
    private _cli: CLI;
    private _environment: Environment;
    private _resources: Resources;
    private _orm: ORM;
    private _server: Server;
    private _authenticator: Authenticator;
    
    // Initialization
    constructor() {
        this._cli = new CLI();
        this.configureCLI();
    }

    // Modes 
    private startServer(): Promise<void> {
        Logger.info('Starting server...');
        this._server = new Server(this._environment, this._resources, this._orm, this._authenticator);
        return this._server.start();
    }

    private printRoutes(): Promise<void> {
        RoutePrinter.printRoutes(this._environment, this._resources, this._orm);
        return null;
    }

    private startREPL(): Promise<void> {
        let repl = new REPL(this._orm);
        return repl.run();
    }
    
    private manageClients(): Promise<void> {
        if (this._cli.command == 'clients') {
            return ClientManager.list(this._authenticator);
        }
        else if (this._cli.command == 'clients:add') {
            return ClientManager.create(this._authenticator);
        }
        else if (this._cli.command == 'clients:remove') {
            return ClientManager.destroy(this._authenticator);
        }
    }

    // Startup
    private loadORM(): Promise<void> {
        return this.initializeORM();
    }

    private migrateORM(): Promise<void> {

        let command = this._cli.command;

        let strategyMap = {
            'db:alter': MigrationStrategy.Alter,
            'db:create': MigrationStrategy.Create,
            'db:drop': MigrationStrategy.Drop
        };

        let strategy = strategyMap[command];
        
        // Hacky, but it'll work for a debug string
        let rawCommand = command.replace('db:', '');
        Logger.info('Migrating database with the `' + rawCommand + '` strategy...');

        return this.initializeORM(strategy);
    }

    private initializeORM(strategy: MigrationStrategy = MigrationStrategy.Safe): Promise<void> {
        let self = this;
        return DB.load(this._environment).then(function(adapters) {
            let orm = new ORM(self._resources.resources, adapters, strategy);
            self._orm = orm;
            self.postLoad();
            return orm.connect();
        });
    }

    private loadResources(path: string): Promise<Resources> {
        return new Promise<Resources>(function(resolve: (result: Resources) => void, reject: (error: any) => void) {
            Logger.info('Loading resources...');
            let resources = new Resources(path);
            resources.load(function(error) {
                if (error) reject(error);
                else resolve(resources);
            });
        });
    }

    private loadEnvironment(path: string): Promise<Environment> {
        return new Promise<Environment>(function(resolve: (result: Environment) => void, reject: (error: any) => void) {
            Logger.info('Loading environment...');
            let environment = new Environment(path);
            environment.load(function(error) {
                if (error) reject(error);
                else resolve(environment);
            });
        });
    }

    private preFlight() {
        // Inject the Authenticator, so we have someplace to store our authorized clients
        this._authenticator = new Authenticator();
        this._resources.addResource(this._authenticator.resource);
    }

    private postLoad() {
        // Now that the ORM is loaded, tell the authenticator 
        // about it so it can validate against the _client resource
        this._authenticator.orm = this._orm;
    }

    private loadConfiguration(): Promise<void> {
        var self = this;

        let paths = {
            environment: this._cli.options['environment'] || ObsidianServer.getAbsolutePath('environment.json'),
            resources: this._cli.options['resources'] || ObsidianServer.getAbsolutePath('resources.json')
        };

        let promises = {
            environment: this.loadEnvironment(paths.environment),
            resources: this.loadResources(paths.resources)
        };

        return new Promise<void>(function(fulfill, reject) {
            Promise.props(promises).then(function(results) {
                self._environment = results['environment'];
                self._resources = results['resources'];
                self.preFlight();
                fulfill(undefined);
            }).catch(reject);
        });
    }

    private runMode(mode: AppMode) {
        let self = this;

        Logger.hello();
        Logger.info('Obsidian Server version', Constants.version);

        let promise: Promise<void>

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
    }

    private catchError(error: any) {
        
        Logger.error(error, 'An unexpected error occurred');

        console.error(error);

        this.teardown(-1);
    }
	
    // Shutdown
	
    private teardownPromise(): Promise<void> {
        let self = this;
        return new Promise<void>(function(fulfill, reject) {
            fulfill(self.teardown());
        });
    }

    private teardown(exitCode: number = 0) {
        let self = this;
        
        let promises: Array<Promise<void>> = [];

        if (this._orm) {
            promises.push(this._orm.disconnect());
        }

        if (this._server) {
            promises.push(this._server.stop());
        }

        Promise.all(promises).finally(function() {
            if (exitCode == 0) {
                Logger.goodbye();
            }
            process.exit(exitCode);
        });
    }
			
    // Command Line Interface
    private configureCLI() {
        let self = this;

        // Start the logger
        Logger.start();

        // Parameters
        _.each(globalOptions, function(description, option) {
           self._cli.addOption(option, description);
        });
        
        // Modes
        _.each(commands, function(command, name) {
            self._cli.addCommand(name, command.description, self.runMode.bind(self, command.mode));
        });
        
        // Catcher
        this.registerInterruptHandler();
    }

    private registerInterruptHandler() {
        let self = this;
        process.on('SIGINT', function() {
            Logger.info('Shutting down in response to interrupt signal...', null, false, true);
            self.teardown();
        });
    }

    run() {
        this._cli.run(process.argv);
    }
	
    // Helpers
    private static getAbsolutePath(filename: string): string {
        return Path.join(process.cwd(), filename);
    }

}

export = ObsidianServer;