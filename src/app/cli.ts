
/**
 * CLI
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

import Commander = require('commander');
import Constants = require('../config/constants');

type Callback = () => void;
type Options = { [id: string]: string };

class CLI {

	// Private members
	private _parser: commander.ICommand;
	private _command: string;
	
	// Initialization
	constructor() {
		this._parser = Commander.version(Constants.version);
	}
	
	// CLI Management
	addOption(option: string, description?: string) {
		this._parser.option(option, description);
	}

	addCommand(command: string, description?: string, handler?: Callback) {
		let self = this;
		this._parser.command(command, description);
		this._parser.on(command, function() {
			if (handler) {
				self._command = command;
				handler();
			}
		});
	}

	run(args: string[]) {
		this._parser.parse(args);
	}

	// Accessors
	get options(): Options {
		return this._parser.opts();
	}
		
	get command(): string {
		return this._command;
	}

}

export = CLI;