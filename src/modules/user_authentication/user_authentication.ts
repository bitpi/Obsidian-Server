/**
 * UserAuthentication
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Joi = require('joi');
import BCrypt = require('bcrypt');

import MappingHelpers = require('../../helpers/mapping_helpers');
import Module = require('../module');
import Attribute = require('../../api/attribute');
import StringHelpers = require('../../helpers/string_helpers');
import Response = require('../../api/responses/response');
import Request = require('../../api/request');
import Method = require('../../api/methods/method');
import MethodDescriptor = require('../../api/method_descriptor');
import Resource = require('../../api/resource');
import Model = require('../../db/model');
import LoginMethod = require('./login_method');
import UserAuthenticationAttributes = require('./user_authentication_attributes');

let _attributes = [
	UserAuthenticationAttributes.tokenAttribute,
	UserAuthenticationAttributes.passwordAttribute
];

class UserAuthentication extends Module {
	 
	// Module name
	static moduleName: string = UserAuthenticationAttributes.moduleName;

	// Private members
	private static validationSchema = Joi.object({
		email: Joi.boolean().valid(true),
		username: Joi.boolean().valid(true)
	}).or(['email', 'username']);

	private _filteredKeys: Array<string>;
	
	// Initialization
	constructor(options: any) {

		let validationResult = Joi.validate(options, UserAuthentication.validationSchema);

		if (validationResult.error) {
			throw validationResult.error;
		}

		let validated = validationResult.value;

		let attributes = _.clone(_attributes);

		if (validated['email']) {
			attributes.push(UserAuthenticationAttributes.emailAttribute);
		}

		if (validated['username']) {
			attributes.push(UserAuthenticationAttributes.usernameAttribute);
		}

		super(attributes);

		this._filteredKeys = _.map(_attributes, function(attribute) {
			return attribute.name;
		});
	}

	// Password hashing
	private genSalt(): Promise<string> {
		return new Promise<string>(function(resolve, reject) {
			BCrypt.genSalt(function(err, salt) {
				if (err) reject(err);
				else resolve(salt);
			});
		});
	}

	private hashPassword(salt: string, password: string): Promise<string> {
		return new Promise<string>(function(resolve, reject) {
			BCrypt.hash(password, salt, function(err, hashed) {
				if (err) reject(err);
				else resolve(hashed);
			});
		});
	}

	private generateHash(password: string): Promise<string> {
		let self = this;
		return this.genSalt().then(function(salt) {
			return self.hashPassword(salt, password);
		});
	}

	// Transformers
	transformRequest(request: Request): Promise<Request> {
		return super.transformRequest(request).bind(this).then(this.hashAndDelete);
	}

	transformResponse(response: Response): Promise<Response> {
		let self = this;
		return new Promise<Response>(function(fulfill, reject) {
			let modifiedResponseObject = MappingHelpers.filterKeys(response.responseObject, self._filteredKeys);
			response.responseObject = modifiedResponseObject;
			fulfill(response);
		});
	}
	
	// Hashing
	private hashAndDelete(request: Request): Promise<Request> {
		let self = this;
		return new Promise<Request>(function(fulfill, reject) {

			let params = request.params;
			let record = request.params['record'];

			if (record) {
				
				// Sanitize the record
				
				delete record[UserAuthenticationAttributes.tokenAttribute.name];

				let inputPassword = record[UserAuthenticationAttributes.passwordAttribute.name];

				if (inputPassword) {
					self.generateHash(inputPassword).then(function(hashed) {
						record[UserAuthenticationAttributes.passwordAttribute.name] = hashed;
						params['record'] = record;
						request.params = params;
						fulfill(request);
					}).catch(reject);
				}
				else {
					params['record'] = record;
					request.params = params;
					fulfill(request);
				}

			}
			else {
				request.params = params;
				fulfill(request);
			}

		});
	}
	
	// Custom methods
	generateMethods(model: Model, resource: Resource): Array<Method>  {
		let methods: Array<Method> = [];
		
		let loginMethodName = StringHelpers.prefixKey(UserAuthenticationAttributes.moduleName, 'login');
		let loginMethodDescriptor = new MethodDescriptor(loginMethodName, true);
		let loginMethod = new LoginMethod(resource, loginMethodDescriptor, model);
		methods.push(loginMethod);
		
		return super.generateMethods(model, resource).concat(methods);
	}

}

export = UserAuthentication;