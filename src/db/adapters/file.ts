/**
 * File Adapter
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Joi = require('joi');
let Untildify = require('untildify');

import Adapter = require('./adapter');

class File extends Adapter {

	// Private members
	private static schema = Joi.object({
		type: Joi.string().valid('file'),
		options: Joi.object().required().keys({
			directory: Joi.string().min(1).required()
		})
	});

	// Initialization
	constructor(connectionName: string, config: {}) {
		super(connectionName, config);

		let validationResult = Joi.validate(config, File.schema);

		if (validationResult.error) {
			throw validationResult.error;
		}

		this._adapterName = 'file';
		this._adapter = this.shimAdapter();
		
		let path = Untildify(validationResult.value['options']['directory']);
		
		this._options = {
			filePath: path,
			schema: true	
		};
	}
	
	// Shimming
	private shimAdapter(): any {
		let adapter = require('sails-disk');
		return adapter;
	}
	
}

export = File;