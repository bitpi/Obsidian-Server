/**
 * ProjectGenerator
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Path = require('path');
import FS = require('fs');
import Promise = require('bluebird');
import Sanitizer = require('sanitize-filename');
let Prompt = require('prompt');
let Untildify = require('untildify');

import Logger = require('./logger');

function environmentGenerator() {
	return {
		config: {
			server: {
				host: '0.0.0.0',
				port: 8000
			},
			db: {
				type: 'file',
				options: {
					directory: './db/'
				}
			}
		}, 
		modules: {},
		custom: {}
	}
}

function _resourcesGenerator(name: string): {} {
	return {
		metadata: {
			name: name,
			version: '0.0.1'
		},
		resources: {}
	};
}

let promptSchema = {
	properties: {
		name: {
			description: 'Project Name:',
			required: true
		},
		location: {
			description: 'Project Location:',
			required: true,
			default: './'
		}
	}
};

export function generate(): Promise<void> {
	return new Promise<void>(function(fulfill, reject) {

		Prompt.message = '';
		Prompt.delimiter = '';

		Logger.hideLabels().info('').showLabels();

		Prompt.start();

		Prompt.get(promptSchema, function(err, result) {
			if (err) {
				reject(err);
			}
			else {
				_generate(result.name, result.location);
				fulfill(undefined);
			}
		});

	});
}

function _sanitize(name: string): string {

	var sanitized = Sanitizer(name);
	
	sanitized = sanitized.replace(/\s/g, '-'); // strip whitespace
	sanitized = sanitized.replace(/[^\w-]/g, ''); // strip non-alphanumeric 

	// collapse groups of multiple dashes into one dash 
	while (true) {
		let newString = sanitized.replace(/-+/g, '-');
		if (sanitized == newString) {
			break;
		}
		sanitized = newString;
	}

	return sanitized.toLowerCase();
}

function _mkdir(path: string) {
	try {
		FS.mkdirSync(path);
	}
	catch (e) {
		if ( e.code != 'EEXIST' ) throw e;
	}
}

function _writeJSON(path: string, json: any) {
	let jsonString = JSON.stringify(json, null, 2);
	FS.writeFileSync(path, jsonString);
}

function _generate(name: string, location: string) {
	
	Logger.info('Creating project directory...');
	let sanitizedName = _sanitize(name);
	let folder: string = Untildify(Path.join(location, sanitizedName));
	_mkdir(folder);

	Logger.info('Creating database directory...');
	let dbFolder = Path.join(folder, 'db');
	_mkdir(dbFolder);
	
	Logger.info('Creating environment.json...');
	let environment = environmentGenerator();
	let environmentPath = Path.join(folder, 'environment.json');
	_writeJSON(environmentPath, environment);
	
	Logger.info('Creating resources.json...');
	let resources = _resourcesGenerator(name);
	let resourcePath = Path.join(folder, 'resources.json');
	_writeJSON(resourcePath, resources);
}