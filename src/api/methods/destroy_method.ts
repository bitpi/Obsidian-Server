/**
 * DestroyMethod
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Joi = require('joi');
import Boom = require('boom');

import Constants = require('../../config/constants');
import ResourceMethod = require('./resource_method');
import Resource = require('../resource');
import MethodDescriptor = require('../method_descriptor');
import Model = require('../../db/model');
import Request = require('../request');
import Response = require('../responses/response');
import ErrorResponse = require('../responses/error_response');

class DestroyMethod extends ResourceMethod {

	// Private members
	private static endpointValidator = Joi.object({
		criteria: Joi.object().min(1).unknown().required()
	});

	// Initialization
	constructor(resource: Resource, descriptor: MethodDescriptor, model: Model) {
		super(resource, descriptor, model, Constants.HTTPVerb.DELETE);
	}
	
	// Validation
	validators(): Array<Joi.ObjectSchema> {
		return super.validators().concat([DestroyMethod.endpointValidator]);
	}
	
	// Route Handler
	handle(request: Request, callback: (response: Response) => void) {
		let self = this;
		
		let criteria = request.params['criteria'];
		
		this.model.destroy(criteria).then(function(records){
			
			if (_.isEmpty(records)) {
				let errorMessage = 'No records were found matching your criteria';
				let notFound = Boom.notFound(errorMessage);
				let errorResponse = new ErrorResponse(notFound);
				callback(errorResponse);
			}
			else {
				let response = new Response(self.resource.name, records);
				callback(response);
			}
			
		}).catch(function(error){
			let errorResponse = new ErrorResponse(error);
			callback(errorResponse);
		});
	}
	
}

export = DestroyMethod;