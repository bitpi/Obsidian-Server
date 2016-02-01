/**
 * Filter
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Promise = require('bluebird');

import Request = require('../api/request');
import Response = require('../api/responses/response');
import ORM = require('../db/orm');

class Filter {
	
	// Filter name 
	static _filterName: string;
	
	// Private members
	private _orm: ORM;
	
	// Filtering
	before(request: Request): Promise<void> {
		return new Promise<void>(function(fulfill, reject) {
			fulfill(undefined);
		});
	}

	after(request: Request): Promise<void> {
		return new Promise<void>(function(fulfill, reject) {
			fulfill(undefined);
		});
	}
	
	// Accessors
	get orm(): ORM {
		return this._orm;
	}
	
	set orm(orm: ORM) {
		this._orm = orm;
	}
	
}

export = Filter;