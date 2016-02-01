/**
 * Module
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Promise = require('bluebird');

import Attribute = require('../api/attribute');
import Request = require('../api/request');
import Response = require('../api/responses/response');
import Method = require('../api/methods/method');
import Resource = require('../api/resource');
import Model = require('../db/model');

class Module {

	// Module name
	static moduleName: string;
		 
	// Private members
	private _customAttributes: Array<Attribute>;
	 
	// Initialization
	constructor(customAttributes: Array<Attribute>) {
		this._customAttributes = customAttributes;
	}
	 
	// Accessors
	get customAttributes(): Array<Attribute> {
		return this._customAttributes;
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
	
	// Methods
	generateMethods(model: Model, resource: Resource): Array<Method> {
		return [];
	}

}

export = Module;