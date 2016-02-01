/**
 * ErrorResponse
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
import Response = require('./response');

class ErrorResponse extends Response {
	
	// Initialization
	constructor(error: any) {
		
		let boomError: Boom.BoomError

		if (error.isBoom) {
			boomError = <Boom.BoomError>error;
		}
		else if (error.code == 'E_VALIDATION') { //Waterline Validation Error
			let reasons = error.messages;
			let data = {
				reasons: reasons
			};
			boomError = Boom.create(error.status, "Validation Failed", data);
		}
		else if (error.name == 'ValidationError') { //Joi Validation Error
			let joiError = <Joi.ValidationError>error;
			let reasons: { [index: string]: string } = {};
			_.each(joiError.details, function(detail){
				reasons[detail.path] = detail.message;
			});
			let data = {
				reasons: reasons
			};
			boomError = Boom.create(Constants.HTTPStatusCode.UnprocessableEntity, "Validation Failed", data);
		}
		else if (_.isString(error.details)) {
			boomError = Boom.create(Constants.HTTPStatusCode.InternalServerError, error.details);
		}
		else if (_.isString(error.message)) {
			boomError = Boom.create(Constants.HTTPStatusCode.InternalServerError, error.message);
		}
		else {
			boomError = Boom.wrap(error);
		}

		let payload = this.generatePayload(boomError);
		super(Constants.ResponseType.error, payload, boomError.output.statusCode);

	} 
	
	// Formatting
	private generatePayload(error: Boom.BoomError): any {
		let payload: any = {};
		payload.error = error.output.payload.error;
		payload.message = error.message || error.output.payload.message;
		if (error.data && error.data.reasons) {
			payload.reasons = error.data.reasons;
		}
		return payload;
	}

}

export = ErrorResponse;