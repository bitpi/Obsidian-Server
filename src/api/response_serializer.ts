/**
 * ResponseSerializer
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Moment = require('moment');

import Request = require('./request');
import Response = require('./responses/response');
import DateHelpers = require('../helpers/date_helpers');

class ResponseSerializer {
	
	// Private members 
	
	private _request: Request;
	private _response: Response;	 
	
	// Initialization
	constructor(request: Request, response: Response) {
		this._request = request;
		this._response = response;
	}
	
	// Serialization
	serialize(): {} {
		
		let response = {
			_type: this._response.type,
			_requestID: this._request.id,
			_requestTimestamp: DateHelpers.format(this._request.date),
			_responseTimestamp: DateHelpers.format(this._response.date),
			_data: this._response.responseObject
		};
		
		return response;
		
	}
}

export = ResponseSerializer;