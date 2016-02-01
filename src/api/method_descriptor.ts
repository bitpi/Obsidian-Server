/**
 * MethodDescriptor
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Joi = require('joi');
import _ = require('lodash');
import FS = require('fs');
import Path = require('path');

import Constants = require('../config/constants');
import Filter = require('../filters/filter');
import FilterLoader = require('../filters/filter_loader');

class MethodDescriptor {

	// Private members
	private static builtInNames = {
		create: Constants.MethodType.Create,
		read: Constants.MethodType.Read,
		update: Constants.MethodType.Update,
		destroy: Constants.MethodType.Destroy
	};
	
	private static namesSchema = Joi.string().min(1).required();

	private static configSchema = Joi.alternatives([
		Joi.boolean().valid(true),
		Joi.object({
			implementation: Joi.string(),
			method: Joi.string().valid(_.values(Constants.HTTPVerb)),
			filters: Joi.object().default({}).unknown()
		}).with('implementation', 'method').with('method', 'implementation')
	]);

	private static validationSchema = Joi.alternatives([
		Joi.object({
			name: MethodDescriptor.namesSchema,
			config: MethodDescriptor.configSchema
		})
	]);

	private _type: Constants.MethodType;
	private _name: string;
	private _filters: Array<Filter>;
	private _modulePath: string;
	private _method: string; 

	// Initialization
	constructor(name: string, config: any) {

		let options = {
			name: name,
			config: config
		};

		let validationResult = Joi.validate(options, MethodDescriptor.validationSchema);

		if (validationResult.error) {
			throw validationResult.error;
		}

		let validated = validationResult.value;

		let endpointName = validated['name'];
		this._name = endpointName;
		
		this._type = MethodDescriptor.builtInNames[endpointName];

		if (this._type == undefined) {
			this._type == Constants.MethodType.Custom;
		}

		let validatedConfig = validated['config'];
		if (_.isObject(validatedConfig)) {
			
			let filters = validatedConfig['filters'];
			if (_.isObject(filters)) {
				this._filters = _.map(filters, function(object, key: string) {
					return FilterLoader.loadFilter(key, object);
				});
			}
			
			let implementationPath = validatedConfig['implementation'];
			if (implementationPath) {
				let joined = implementationPath[0] == '/' ? implementationPath : Path.join(process.cwd(), implementationPath);
				FS.accessSync(joined, FS.R_OK); // throws if the file is not readable
				this._modulePath = joined.substr(0, joined.lastIndexOf('.js'));
				this._type = Constants.MethodType.Custom;
				this._method = validatedConfig['method'];
			}
			
		}
		
		
	}
	
	// Accessors
	get type(): Constants.MethodType {
		return this._type;
	}

	get name(): string {
		return this._name;
	}

	get filters(): Array<Filter> {
		return this._filters;
	}

	get modulePath(): string {
		return this._modulePath;
	}
	
	get method(): string {
		return this._method;
	}

}

export = MethodDescriptor;