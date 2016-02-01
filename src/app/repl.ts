/**
 * REPL
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Promise = require('bluebird');
let Prompt = require('prompt');
let PrettyJSON = require('prettyjson');

import ORM = require('../db/orm');
import Logger = require('./logger');

interface REPLResponse {
	result: any
	isError: boolean
}

class REPL {
	
	// Private members
	private static commandSchema = {
		properties: {
			command: {
				description: '>>'
			}
		}
	};

	private _orm: ORM;
	private _context: { [index: string]: any };
	
	// Initialization
	constructor(orm: ORM) {
		this._orm = orm;
		this._context = this._orm.models;
	}
	
	// Prompt
	
	private startPrompt() {
		if (!Prompt.started) {
			Prompt.message = '';
			Prompt.delimiter = '';
			Prompt.start();
		}
	}

	private getCommand(): Promise<string> {
		let self = this;
		return new Promise<any>(function(fulfill, reject) {

			self.startPrompt();

			let schema = _.clone(REPL.commandSchema);

			Prompt.get(schema, function(err, result) {
				if (err) {
					reject(err);
				}
				else {
					fulfill(result.command);
				}
			});

		});
	}

	private abstractEval(command: string): any {
		
		// fake 'with' statement
		let keys = _.keys(this);
		for (let i in keys) {
			let key = keys[i];
			let str = 'var ' + key + ' = this.' + key + ';';
			eval(str);
		}
		
		return eval(command);	
	}
	
	private evaluateCommand(command: string): Promise<any> {
		let self = this;
		return new Promise<any>(function(fulfill, reject){
			
			try {
				let result = self.abstractEval.call(self._context, command);
				fulfill(result);
			}
			catch (error) {
				fulfill(error);
			}
			
		});
	}

	private printResult(result: any): Promise<void> {
	
		if (result instanceof Promise) {
			let promise = <Promise<any>>result;
			return promise.then(this.printResult);
		}
		
		Logger.hideLabels().info('').showLabels();
	
		if (_.isError(result)) {
			Logger.error(result);
		}
		else {
			try {
				let jsonResult = JSON.parse(JSON.stringify(result)); // to ensure we only get properties exposed in toJSON
				let rendered = PrettyJSON.render(jsonResult);
				Logger.hideLabels().info(rendered).showLabels();
			}	
			catch (e) {
				Logger.hideLabels().info(result).showLabels();
			}
		}
		
		Logger.hideLabels().info('').showLabels();
	}

	private runner(): Promise<void> {
		return this.getCommand().bind(this).then(this.evaluateCommand).then(this.printResult).then(this.runner);
	}

	run(): Promise<void> {
		Logger.hideLabels().info('').showLabels();
		return this.runner().catch(function(error) {
			let pred = error.message == 'canceled'; // this seems bad
			return pred;
		}, function(error){
			Logger.hideLabels().info('').showLabels();
		});
	}

}

export = REPL;