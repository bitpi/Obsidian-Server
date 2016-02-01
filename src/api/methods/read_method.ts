/**
 * ReadMethod
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Boom = require('boom');
import Joi = require('joi');

import Constants = require('../../config/constants');
import MappingHelpers = require('../../helpers/mapping_helpers');
import ResourceMethod = require('./resource_method');
import Resource = require('../resource');
import MethodDescriptor = require('../method_descriptor');
import Model = require('../../db/model');
import Request = require('../request');
import Response = require('../responses/response');
import ErrorResponse = require('../responses/error_response');

class ReadMethod extends ResourceMethod {
	
	// Private members
	private static endpointValidator = Joi.object({
		criteria: Joi.object().unknown().default({}),
		sort: Joi.string().optional().default(null),
		include: Joi.array().items(Joi.string().min(1)).optional(),
		pagination: Joi.object({
			page: Joi.number().integer().min(1).required(),
			limit: Joi.number().integer().min(1).required()
		}).default({
			page: 0,
			limit: 1
		})
	});
	
	// Initialization
	constructor(resource: Resource, descriptor: MethodDescriptor, model: Model) {
		super(resource, descriptor, model, Constants.HTTPVerb.GET);
	}
	
	// Validation
	validators(): Array<Joi.ObjectSchema> {
		return super.validators().concat([ReadMethod.endpointValidator]);
	}
	
	// Route Handler
	handle(request: Request, callback: (response: Response) => void) {
		let self = this;

		let sortKeys: Array<string> = [];

		let sortList: string = request.params['sort'];
		if (!_.isEmpty(sortList)) {
			let sortComponents = sortList.split(',');
			let trimmedComponents = _.map(sortComponents, function(component) { return _.trim(component); });
			sortKeys = trimmedComponents;
		}

		let criteria = MappingHelpers.filterQueryStringNulls(request.params['criteria']);
		let pagination = request.params['pagination'];
		let include = request.params['include'];

		this.model.read(criteria, sortKeys, pagination.page, pagination.limit, include).then(function(records) {
			let response = new Response(self.resource.name, records || []);
			callback(response);
		}).catch(function(error) {
			let errorResponse = new ErrorResponse(error);
			callback(errorResponse);
		});

	}
}

export = ReadMethod;