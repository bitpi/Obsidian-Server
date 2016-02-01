/**
 * MetadataMethod
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Hapi = require('hapi');

import Constants = require('../../config/constants');
import Method = require('./method');
import Request = require('../request');
import Response = require('../responses/response');
import Metadata = require('../metadata');

class MetadataMethod extends Method {
	 
	// Private members
	private _metadata: Metadata;
	 
	// Initialization
	constructor(metadata: Metadata) {
		super(Constants.HTTPVerb.GET, Constants.BuiltInResource.metadata);
		this._metadata = metadata;
	}
	
	// Overrides
	handle(request: Request, callback: (response: Response) => void) {
		let data = {
			name: this._metadata.name,
			version: this._metadata.version
		};
		let response = new Response('metadata', data);
		callback(response);
	}

}

export = MetadataMethod;