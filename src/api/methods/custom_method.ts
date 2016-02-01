/**
 * CustomMethod
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */
 
import _ = require('lodash'); 

import Constants = require('../../config/constants');
import ResourceMethod = require('./resource_method');
import Resource = require('../resource');
import MethodDescriptor = require('../method_descriptor');
import Model = require('../../db/model');
import Request = require('../request');
import Response = require('../responses/response');
import ErrorResponse = require('../responses/error_response');

 class CustomMethod extends ResourceMethod {
	 
	private _implementation: (request: Request, info: {}, callback: (error: any, response: any) => void) => void;
	private _models: { [index: string] : Model };
	private _config: {};
	
	constructor(resource: Resource, descriptor: MethodDescriptor, model: Model, models: { [index: string] : Model }, config: {}, verb: string, modulePath: string) {
		super(resource, descriptor, model, verb);
		this._models = models;
		this._config = config;
		this._implementation = require(modulePath);
		if (!_.isFunction(this._implementation)) {
			let errorString = "Module at " + modulePath + " must export a single function.  For more details, visit https://engine.tendigi.com/";
			throw new Error(errorString);
		}
	}
	
	handle(request: Request, callback: (response: Response) => void) {
		
		let self = this;
		
		let info = {
			models: this._models,
			config: this._config
		};
		
		this._implementation(request, info, function(error, object) {
			if (error) {
				let response = new ErrorResponse(error);
				callback(response);
			}
			else {
				
				let responseArray: Array<any> = [];
				
				if (_.isArray(object)) {
					responseArray = object;
				}
				else if (object) {
					responseArray.push(object);
				}
				
				let response = new Response(self.resource.name, responseArray);
				callback(response);
				
			}
		});
	}
	
 }
 
 export = CustomMethod;