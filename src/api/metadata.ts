/**
 * Metadata
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */


class Metadata {

	// Private variables
	private _name: string;
	private _version: string;

	// Initialization
	constructor(name: string, version: string) {
		this._name = name;
		this._version = version;
	}
	
	// Accessors
	get name(): string {
		return this._name;
	}

	get version(): string {
		return this._version;
	}

}

export = Metadata;