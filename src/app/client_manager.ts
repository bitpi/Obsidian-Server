
/**
 * ClientManager
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Promise = require('bluebird');
import Chance = require('chance');
let Prompt = require('prompt');

import Logger = require('./logger');
import Authenticator = require('../api/authenticator');

let _chance = new Chance();

function _pick(client: {}): {} {
	return _.pick(client, ['name', 'key', 'secret']);
}

function _createClient(authenticator: Authenticator, name: string, key: string, secret: string): Promise<void> {
	return new Promise<void>(function(fulfill, reject) {

		Logger.hideLabels().info('').showLabels();
		Logger.info('Creating client...');

		authenticator.createClient(name, key, secret).then(function(client) {
			let picked = _pick(client);
			Logger.info('Client created successfully', picked, true);
			Logger.hideLabels().info('').showLabels();
			fulfill(undefined);
		}).catch(reject);

	});
}

function _deleteClient(authenticator: Authenticator, key: string): Promise<void> {
	Logger.hideLabels().info('').showLabels();
	Logger.info('Removing client...');
	return authenticator.deleteClient(key).then(function(success) {
		
		if (success) {
			Logger.info('Client removed successfully', null, true);
		}
		else {
			Logger.info('Failed to remove client', null, true);
		}
		
		Logger.hideLabels().info('').showLabels();
	});
};

function _startPrompt() {
	Prompt.message = '';
	Prompt.delimiter = '';
	Logger.hideLabels().info('').showLabels();
	Prompt.start();
}

export function list(authenticator: Authenticator): Promise<void> {
	return authenticator.listClients().then(function(clients) {

		Logger.hideLabels().info('').showLabels();
		Logger.info('Fetching client list...');

		if (_.isEmpty(clients)) {
			Logger.info('No clients found.', null, true);
		}
		else {
			let mapped = _.map(clients, _pick);
			_.each(mapped, function(client, i) {
				let label = 'Client ' + i;
				Logger.info('', client, true);
			});
		}


		Logger.hideLabels().info('').showLabels();

	});
}

export function create(authenticator: Authenticator): Promise<void> {
	return new Promise<void>(function(fulfill, reject) {

		_startPrompt();

		let schema = {
			properties: {
				name: {
					description: 'Client Name:',
					required: true
				},
				key: {
					description: 'Client Key:',
					required: true,
					default: _chance.apple_token()
				},
				secret: {
					description: 'Client Secret:',
					required: true,
					default: _chance.apple_token()
				}
			}
		};

		Prompt.get(schema, function(err, result) {
			if (err) {
				reject(err);
			}
			else {
				let name = result['name'];
				let key = result['key'];
				let secret = result['secret'];
				_createClient(authenticator, name, key, secret).then(fulfill).catch(reject);
			}
		});

	});
}

export function destroy(authenticator: Authenticator): Promise<void> {

	return new Promise<void>(function(fulfill, reject) {


		_startPrompt();

		let schema = {
			properties: {
				key: {
					description: 'Client key to delete:',
					required: true
				}
			}
		};

		Prompt.get(schema, function(err, result) {
			if (err) {
				reject(err);
			}
			else {
				let key = result['key'];
				_deleteClient(authenticator, key).then(fulfill).catch(reject);
			}
		});

	});

}