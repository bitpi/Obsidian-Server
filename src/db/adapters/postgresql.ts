/**
 * PostgreSQL Adapter
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

import Joi = require('joi');

import Constants = require('../../config/constants');
import Adapter = require('./adapter');

let _defaultPostgresURL = process.env[Constants.EnvironmentVariables.postgres_url];

class PostgreSQL extends Adapter {

	// Private members
	private static schema = Joi.object({
		type: Joi.string().valid('postgres'),
		options: Joi.object().required().keys({
			url: Joi.string().default(_defaultPostgresURL).uri({ scheme: 'postgres' }),
			pool: Joi.boolean().default(false),
			ssl: Joi.boolean().default(false)
		})
	});

	// Initialization
	constructor(connectionName: string, config: {}) {
		super(connectionName, config);

		let validationResult = Joi.validate(config, PostgreSQL.schema);
		
		if (validationResult.error) {
			throw validationResult.error;
		}

		this._adapterName = 'postgres';
		this._adapter = this.shimAdapter();
		this._options = validationResult.value['options'];
	}
	
	// Shimming
	private shimAdapter(): any {
		let adapter = require('sails-postgresql');
		return adapter;
	}
	
}

export = PostgreSQL;