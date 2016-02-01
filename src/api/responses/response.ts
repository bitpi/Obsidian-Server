/**
 * Response
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Moment = require('moment');

import Constants = require('../../config/constants');
import MappingHelpers = require('../../helpers/mapping_helpers');

function _decodeResponse(object: any): any {
	return MappingHelpers.mapToJSON(object);
}

class Response {
		
	// Private members
	private _statusCode: Constants.HTTPStatusCode;
	private _type: string;
	private _responseObject: any = null
	private _date: Date;
	private _responseHeaders: { [index: string] : string } = {};
	
	// Initialization
	constructor(type: string, responseObject: any = null, statusCode: Constants.HTTPStatusCode = Constants.HTTPStatusCode.Ok) {
		this._statusCode = statusCode;
		this._type = type;
		this._responseObject = _decodeResponse(responseObject);
		this._date = Moment().toDate();
	}
	
	// headers
	addResponseHeader(name: string, value: string) {
		this._responseHeaders[name] = value;
	}
	
	// Accessors
	get statusCode(): Constants.HTTPStatusCode {
		return this._statusCode;
	}
	
	get type(): string {
		return this._type;
	}
	
	get responseObject(): any {
		return this._responseObject;
	}
	
	set responseObject(responseObject: any) {
		this._responseObject = _decodeResponse(responseObject);
	}
	
	get date(): Date {
		return this._date;
	}
	
	get responseHeaders(): { [index: string] : string } {
		return this._responseHeaders;
	}
}

export = Response;