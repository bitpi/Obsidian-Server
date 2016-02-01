/**
 * CreateMethod
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Promise = require('bluebird');
import Joi = require('joi');

import Constants = require('../../config/constants');
import ResourceMethod = require('./resource_method');
import Resource = require('../resource');
import MethodDescriptor = require('../method_descriptor');
import Model = require('../../db/model');
import Request = require('../request');
import Response = require('../responses/response');
import ErrorResponse = require('../responses/error_response');

class CreateMethod extends ResourceMethod {
	
	// Private members
	private static endpointValidator = Joi.object({
		record: Joi.object().unknown().default({})
	});
	
	// Initialization
	constructor(resource: Resource, descriptor: MethodDescriptor, model: Model) {
		super(resource, descriptor, model, Constants.HTTPVerb.POST);
	}
	
	// Validation
	validators(): Array<Joi.ObjectSchema> {
		let relationshipValidator = Joi.object({
			record: this.relationshipValidations
		});
		return super.validators().concat([CreateMethod.endpointValidator, relationshipValidator]);
	}
	 
	// Route Handler
	handle(request: Request, callback: (response: Response) => void) {
		let self = this;
		let record = request.params['record'];
		this.model.create(record).then(function(record) {
			let response = new Response(self.resource.name, record, Constants.HTTPStatusCode.Created);
			callback(response);
		}).catch(function(error) {
			let response = new ErrorResponse(error);
			callback(response);
		});
	}

}

export = CreateMethod;