/**
 * Method
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Promise = require('bluebird');
import Boom = require('boom');
import Joi = require('joi');

import Constants = require('../../config/constants');
import Request = require('../request');
import Response = require('../responses/response');
import ErrorResponse = require('../responses/error_response');
import Filter = require('../../filters/filter');

class Method {
	 
	// Private members
	private _verb: string;
	private _name: string;
	private _filters: Array<Filter>;
	
	// Initialization
	constructor(verb: string, name: string) {
		this._verb = verb;
		this._name = name;
	}
	 
	// Validation
	validators(): Array<Joi.ObjectSchema> {
		return [];
	}
	 
	// Handling
	handle(request: Request, callback: (response: Response) => void) {
		let response = new ErrorResponse(Boom.notFound());
		callback(response);
	}
	 
	// Transformers 
	transformRequest(request: Request): Promise<Request> {
		return new Promise<Request>(function(fulfill, reject){
			fulfill(request);
		});
	}
	
	transformResponse(response: Response): Promise<Response> {
		return new Promise<Response>(function(fulfill, reject){
			fulfill(response);
		});
	}
	 
	// Accessors
	get verb(): string {
		return this._verb;
	}

	get name(): string {
		return this._name;
	}
	
	get filters(): Array<Filter> {
		return this._filters;
	}
	
	set filters(filters: Array<Filter>) {
		this._filters = filters;
	}

}

export = Method;