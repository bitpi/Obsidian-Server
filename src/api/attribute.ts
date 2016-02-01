/**
 * Attribute
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

import Joi = require('joi');
import _ = require('lodash');

class Attribute {

	// Private members
	private static typeMap: { [index: string] : Joi.Schema } = {
		'integer': Joi.number().integer(),
		'float': Joi.number(),
		'string': Joi.string(),
		'boolean': Joi.boolean(),
		'date': Joi.date()
	};

	private static dbTypeMap: { [index: string]: string } = {
		'integer': 'integer',
		'float': 'float',
		'string': 'string',
		'boolean': 'boolean',
		'date': 'datetime'
	}; 

	private static typeSchema(type: string): Joi.ObjectSchema {
		return Joi.object({
			'type': Joi.string().valid(type).required(),
			'default': Joi.alternatives([
				Attribute.typeMap[type],
				Joi.func()
			]).optional(),
			'index': Joi.boolean().valid(true).optional(),
			'unique': Joi.boolean().valid(true).optional()
		});
	};

	private _name: string;
	private _type: string;
	private _index: boolean;
	private _unique: boolean;
	private _defaultValue: any;

	// Initialization

	constructor(name: string, config: {}) {
		
		this._name = name;

		let alternativeSchemas: Array<Joi.Schema> = _.map(Attribute.typeMap, function(value, key) {
			return Attribute.typeSchema(key);
		});

		let schema = Joi.alternatives(alternativeSchemas);

		let validationResult = Joi.validate(config, schema);

		if (validationResult.error) {
			throw validationResult.error;
		}

		let validatedObject = validationResult.value;

		this._type = validatedObject['type'];
		this._defaultValue = validatedObject['default'];
		this._index = validatedObject['index'];
		this._unique = validatedObject['unique'];

	}

	// Accessors

	get name(): string {
		return this._name;
	}

	get type(): string {
		return this._type;
	}

	get index(): boolean {
		return this._index;
	}

	get unique(): boolean {
		return this._unique;
	}

	get defaultValue(): any {
		return this._defaultValue;
	} 

	get dbType(): string {
		return Attribute.dbTypeMap[this.type];
	}

}

export = Attribute;
