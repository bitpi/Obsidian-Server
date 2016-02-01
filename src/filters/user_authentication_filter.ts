/**
 * UserAuthenticationFilter
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
import Promise = require('bluebird');

import Constants = require('../config/constants');
import Filter = require('./filter');
import Request = require('../api/request');
import Response = require('../api/responses/response');
import Model = require('../db/model');
import UserAuthentication = require('../modules/user_authentication/user_authentication');
import UserAuthenticationAttributes = require('../modules/user_authentication/user_authentication_attributes');

let _filterName = 'user_authentication';

class UserAuthenticationFilter extends Filter {
	 
	// Filter name
	static filterName: string = _filterName;
	 
	// Private members
	private static validationSchema = Joi.object({
		resource: Joi.string().min(1).required(),
		match_attribute: Joi.string().min(1).optional()
	});

	private _resourceName: string;
	private _matchAttribute: string;

	// Initialization
	constructor(options: any) {

		let validationResult = Joi.validate(options, UserAuthenticationFilter.validationSchema);

		if (validationResult.error) {
			throw validationResult.error;
		}

		let validated = validationResult.value;

		this._resourceName = validated['resource'];
		this._matchAttribute = validated['match_attribute'];

		super();
	}
	
	// Filtering
	before(request: Request): Promise<void> {
		let self = this;
		return super.before(request).then(function() {
			return self.authenticateUser(request);
		});
	}
	
	// User authentication
	private authenticateUser(request: Request): Promise<void> {
		let self = this;
		return new Promise<void>(function(fulfill, reject) {

			let bearerToken = request.headers[Constants.AuthHeaders.bearerToken];

			if (_.isEmpty(bearerToken)) {
				let error = Boom.unauthorized();
				reject(error);
				return;
			}

			let criteria = {};
			criteria[UserAuthenticationAttributes.tokenAttribute.name] = bearerToken;

			let model = self.orm.model(self._resourceName);

			model.read(criteria, null, 1, 1).then(function(records) {
				if (_.isEmpty(records)) {
					let error = Boom.unauthorized();
					reject(error);
				}
				else {

					let authenticatedUser = records[0];

					if (self._matchAttribute) {

						let idValidation: Joi.SchemaMap = {};
						idValidation[self._matchAttribute] = Joi.any().valid(authenticatedUser['id']).required();

						let validationSchema = Joi.object({
							criteria: Joi.object(idValidation).unknown()
						}).unknown();

						let validationResult = Joi.validate(request.params, validationSchema);

						if (validationResult.error) {
							let error = Boom.unauthorized();
							reject(error);
						}
						else {
							fulfill(undefined);
						}

					}
					else {
						fulfill(undefined);
					}

				}
			});

		});
	}
}


export = UserAuthenticationFilter;