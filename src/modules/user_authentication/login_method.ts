/**
 * LoginMethod
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
import BCrypt = require('bcrypt');

import Constants = require('../../config/constants');
import Resource = require('../../api/resource');
import MethodDescriptor = require('../../api/method_descriptor');
import ResourceMethod = require('../../api/methods/resource_method');
import Request = require('../../api/request');
import Response = require('../../api/responses/response');
import ErrorResponse = require('../../api/responses/error_response');
import Model = require('../../db/model');
import UserAuthentication = require('./user_authentication');
import UserAuthenticationAttributes = require('./user_authentication_attributes');

let _validations: Joi.SchemaMap = {};
_validations[UserAuthenticationAttributes.emailAttribute.name] = Joi.string().email();
_validations[UserAuthenticationAttributes.usernameAttribute.name] = Joi.string().min(1);
_validations[UserAuthenticationAttributes.passwordAttribute.name] = Joi.string().min(1).required();

let _criteriaValidation = Joi.object(_validations).unknown().or([UserAuthenticationAttributes.emailAttribute.name, UserAuthenticationAttributes.usernameAttribute.name]);

class LoginMethod extends ResourceMethod {
	 
	// Private members 
	private static validationSchema = Joi.object({
		criteria: _criteriaValidation.required()
	}); 
	
	// Initialization
	constructor(resource: Resource, descriptor: MethodDescriptor, model: Model) {
		super(resource, descriptor, model, Constants.HTTPVerb.POST);
	}
	
	// Validation
	validators(): Array<Joi.ObjectSchema> {
		return super.validators().concat([LoginMethod.validationSchema]);
	}
	
	// Route Handler
	handle(request: Request, callback: (response: Response) => void) {
		let self = this;

		let criteria = request.params['criteria'];

		let orCriteria: Array<{}> = [];

		if (criteria[UserAuthenticationAttributes.emailAttribute.name]) {
			let match = {};
			match[UserAuthenticationAttributes.emailAttribute.name] = criteria[UserAuthenticationAttributes.emailAttribute.name];
			orCriteria.push(match);
		}

		if (criteria[UserAuthenticationAttributes.usernameAttribute.name]) {
			let match = {};
			match[UserAuthenticationAttributes.usernameAttribute.name] = criteria[UserAuthenticationAttributes.usernameAttribute.name];
			orCriteria.push(match);
		}

		let password = criteria[UserAuthenticationAttributes.passwordAttribute.name];

		this.model.read({
			or: orCriteria
		}, null, 1, 1).then(function(records) {

			if (_.isEmpty(records)) {
				let error = Boom.unauthorized();
				let errorResponse = new ErrorResponse(error);
				callback(errorResponse);
				return;
			}

			let user = records[0];
			let hash = user[UserAuthenticationAttributes.passwordAttribute.name];

			BCrypt.compare(password, hash, function(err, same) {

				if (err || !same) {
					let error = Boom.unauthorized();
					let errorResponse = new ErrorResponse(error);
					callback(errorResponse);
				}
				else {
					let response = new Response(self.resource.name, records);
					let token = user[UserAuthenticationAttributes.tokenAttribute.name];
					response.addResponseHeader(Constants.AuthHeaders.bearerToken, token);
					callback(response);
				}

			});

		}).catch(function(error) {
			let errorResponse = new ErrorResponse(error);
			callback(errorResponse);
		});

	}

}

export = LoginMethod;