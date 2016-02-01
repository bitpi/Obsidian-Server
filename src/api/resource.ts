/**
 * Resource
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

import Joi = require('joi');
import _ = require('lodash');

import Constants = require('../config/constants');
import Attribute = require('./attribute');
import Relationship = require('./relationship');
import MethodDescriptor = require('./method_descriptor');
import Module = require('../modules/module');
import ModuleLoader = require('../modules/module_loader');

class Resource {

	// Private members

	private static validationSchema = Joi.object({
		attributes: Joi.object().default({}),
		relationships: Joi.object().default({}),
		methods: Joi.object().default({}),
		modules: Joi.object().default({}),
		db: Joi.string().default(Constants.defaultDBAdapterName)
	});

	private _name: string;
	private _attributes: Array<Attribute>;
	private _relationships: Array<Relationship>;
	private _methodDescriptors: Array<MethodDescriptor>;
	private _modules: Array<Module>;
	private _db: string;
	private _internal: boolean;

	// Initialization

	constructor(name: string, config: {}, internal: boolean = false) {
		let self = this;
		
		this._name = name;
		this._internal = internal;

		let validationResult = Joi.validate(config, Resource.validationSchema)

		if (validationResult.error) {
			throw validationResult.error;
		}

		let validatedObject = validationResult.value;

		this._db = validatedObject['db'];

		this._attributes = _.map(validatedObject['attributes'], function(object, key: string) {
			return new Attribute(key, object);
		});
		
		this._relationships = _.map(validatedObject['relationships'], function(object, key: string) {
			return new Relationship(key, object);
		});
		
		this._methodDescriptors = _.map(validatedObject['methods'], function(object, key: string) {
			return new MethodDescriptor(key, object);
		});

		this._modules = _.map(validatedObject['modules'], function(object, key: string) {
			let module = ModuleLoader.loadModule(key, object);
			_.each(module.customAttributes, function(attribute) {
				self._attributes.push(attribute);
			});		
			return module;
		});
		
	}
	
	// Accessors
	get connection(): string {
		return this._db;
	}

	get name(): string {
		return this._name;
	}

	get attributes(): Array<Attribute> {
		return this._attributes;
	}

	get relationships(): Array<Relationship> {
		return this._relationships;
	}

	get methodDescriptors(): Array<MethodDescriptor> {
		return this._methodDescriptors;
	}
	
	get modules(): Array<Module> {
		return this._modules;
	}

}

export = Resource;