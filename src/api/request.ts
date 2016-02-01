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
import Chance = require('chance');
import Moment = require('moment');

class Request {
	 
	// Private members
	 
	private static chance = new Chance();
		
	private _headers: Dictionary<string>;
	private _params: Dictionary<any>;
	private _id: string;
	private _date: Date;
	 
	// Initialization
	constructor() {
		this._id = Request.chance.guid();
		this._date = Moment().toDate();
	}
		  
	// Accessors
	
	set headers(headers: Dictionary<string>) {
		this._headers = headers;
	}
	
	get headers(): Dictionary<string> {
		return this._headers;	
	}
	
	set params(params: Dictionary<any>) {
		this._params = params;
	}
	
	get params(): Dictionary<any> {
		return this._params;
	}

	get id(): string {
		return this._id;
	}

	get date(): Date {
		return this._date;
	}
}

export = Request;