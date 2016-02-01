/**
 * DB
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

import Promise = require('bluebird');
import Joi = require('joi');
import _ = require('lodash');

import Constants = require('../config/constants');
import Logger = require('../app/logger');
import _Adapter = require('./adapters/adapter');
import Environment = require('../config/environment');

export type Adapter = _Adapter;
export type Container = [Adapter];

let _adapters: Array<(new (name: string, config: {}) => Adapter)> = [
	require('./adapters/postgresql'),
	require('./adapters/file')
];

function _loadConfig(name: string, config: {}): Promise<Adapter> {

	return new Promise<Adapter>(function(resolve, reject) {

		Logger.info('Configuring adapter `' + name + '` with options', config);

		let promises: Array<Promise<Adapter>> = _.map(_adapters, function(A) {
			return new Promise<Adapter>(function(yep, nope) {
				try {
					let adapter = new A(name, config);
					yep(adapter);
				}
				catch (err) {
					nope(err);
				}
			});
		});

		Promise.any(promises).then(function(adapter) {
			Logger.info('Detected `' + adapter.adapterName + '` database for adapter `' + adapter.connectionName + '`', null, true);
			resolve(adapter);
		}).catch(reject);

	});
}

let _preValidationSchema = Joi.object({
	db: Joi.object().unknown().required()
}).unknown();

let _singleDBSchema: Joi.SchemaMap = {
	type: Joi.string().required(),
	options: Joi.object().unknown().required()
};

function _generateSchema(keys: Array<string>): Joi.Schema {

	// We generate a schema based on the keys present in the 'db' object
	// to support single or multi-database configurations

	var mapped: Joi.SchemaMap = {};

	_.each(keys, function(key) {
		mapped[key] = Joi.object(_singleDBSchema).required();
	});

	_.each(_.keys(_singleDBSchema), function(key) {
		mapped[key] = Joi.any().forbidden();
	});

	let validationSchema = Joi.alternatives([
		Joi.object(_singleDBSchema).required(),
		Joi.object().keys(mapped)
	]);

	return validationSchema;
}

export function load(environment: Environment): Promise<Container> {
		
	let validate = Promise.promisify<{}, {}, Joi.Schema>(Joi.validate);

	return new Promise<Container>(function(resolve, reject) {

		validate(environment.config, _preValidationSchema).then(function(validated: {}) {

			let dbConfig = validated['db'];
			let keys = _.keys(dbConfig);
			return validate(dbConfig, _generateSchema(keys));

		}).then(function(config: { [index: string]: {} }) {

			let singleDB = _.isEmpty(_.difference(_.keys(config), _.keys(_singleDBSchema)));

			var dbConfigs: { [index: string]: {} } = {}

			if (singleDB) {
				Logger.info('Detected single-database environment.');
				dbConfigs[Constants.defaultDBAdapterName] = config;
			}
			else {
				Logger.info('Detected multi-database environment.');
				dbConfigs = config;
			}

			let promises = _.map(dbConfigs, function(options, key) {
				return _loadConfig(key, options);
			});

			Promise.all(promises).then(resolve, reject);

		}).catch(function(error) {
			Logger.error(null, 'Environment.json contains an invalid (or nonexistent) database configuration');
			reject(error);
		});

	});
}