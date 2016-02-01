/**
 * Resources
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

import Joi = require('joi');
import _ = require('lodash');

import Logger = require('../app/logger');
import Configuration = require('./configuration');
import Metadata = require('../api/metadata');
import Resource = require('../api/resource');

let _semverRegex = require('semver-regex')();

class Resources extends Configuration {

	// Private members

	private static validationSchema = Joi.object({
		
		metadata: Joi.object().required().keys({
			name: Joi.string().required(),
			version: Joi.string().regex(_semverRegex).required()
		}),

		resources: Joi.object().required()

	}).unknown(true);

	private _metadata: Metadata;
	private _resources: Array<Resource> = [];

	// Overrides
	
	protected validate(json: {}) {
		
		let result = Joi.validate(json, Resources.validationSchema);
		let error = result.error || super.validate(result.value);
		
		if (error) {
			throw error;
		}

		let validated = result.value;

		this._metadata = new Metadata(validated['metadata']['name'], validated['metadata']['version']);
		Logger.info('Loaded service metadata (`'+this.metadata.name+'` version '+this.metadata.version+')', null, true);

		let resourceDicts = validated['resources'];

		// Load in the resources
		let resources = _.map(resourceDicts, function(value: {}, key: string) {
			let resource = new Resource(key, value);
			Logger.info('Loaded resource `'+key+'`', null, true);
			return resource;
		});
		
		_.each(resources, this.addResource, this);
	}

	// Accessors
	get metadata(): Metadata {
		return this._metadata;
	}

	get resources(): Array<Resource> {
		return this._resources;
	}
	
	// Mutators
	addResource(resource: Resource) {
		if (this._resources) {
			this._resources.push(resource);
		}
		else {
			this._resources = [resource];
		}
	}
}

export = Resources;