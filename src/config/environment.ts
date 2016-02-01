/**
 * Environment
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

import _ = require('lodash')
import Joi = require('joi');
import Path = require('path');

import Configuration = require('./configuration');

class Environment extends Configuration {
	
	// Private members

	private static validationSchema = Joi.object().keys({
		config: Joi.object().required(),
		modules: Joi.object().default({}),
		custom: Joi.object().default({})
	});	

	// Overrides
	
	protected validate(json: {}) {
		let result = Joi.validate(json, Environment.validationSchema);
		let error = result.error || super.validate(result.value);
		if (error) {
			throw error;
		}
	}

	// Properties

	get config(): {} {
		return super.get('config');
	}

	get modules(): {} {
		return super.get('modules');
	}

	get custom(): {} {
		return super.get('custom');
	}
}

export = Environment;