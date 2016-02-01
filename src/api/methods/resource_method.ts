/**
 * ResourceMethod
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Joi = require('joi');

import Constants = require('../../config/constants');
import Method = require('./method');
import Resource = require('../resource');
import MethodDescriptor = require('../method_descriptor');
import Model = require('../../db/model');
import Request = require('../request');
import Response = require('../responses/response');
import Module = require('../../modules/module');

class ResourceMethod extends Method {
	
	// Protected Members
	protected static idValidator = Joi.alternatives([
		Joi.string().min(1),
		Joi.number().integer().min(0),
		Joi.any().valid(null)
	]);

	// Private Members
	private _resource: Resource;
	private _descriptor: MethodDescriptor;
	private _model: Model;

	// Initialization
	constructor(resource: Resource, descriptor: MethodDescriptor, model: Model, verb: string) {
		super(verb, descriptor.name);
		this._resource = resource;
		this._descriptor = descriptor;
		this._model = model;
	}
	
	// Transformers
	transformRequest(request: Request): Promise<Request> {
		let superPromise = super.transformRequest(request);
		return _.reduce(this.resource.modules, function(p, m) {
			return p.then(function(req) {
				return m.transformRequest(req);
			});
		}, superPromise);
	}

	transformResponse(response: Response): Promise<Response> {
		let superPromise = super.transformResponse(response);
		return _.reduce(this.resource.modules, function(p, m) {
			return p.then(function(res) {
				return m.transformResponse(res);
			});
		}, superPromise);
	}
	
	// Accessors
	get resource(): Resource {
		return this._resource;
	}

	get descriptor(): MethodDescriptor {
		return this._descriptor;
	}

	get model(): Model {
		return this._model;
	}

	protected get relationshipValidations(): Joi.Schema {
		let validations: Joi.SchemaMap = {};

		_.each(this.resource.relationships, function(relationship) {
			validations[relationship.name] = ResourceMethod.idValidator;
		});

		return Joi.object(validations).unknown();
	}

}

export = ResourceMethod;