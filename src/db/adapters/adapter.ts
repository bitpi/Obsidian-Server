/**
 * Adapter (Abstract class)
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

class Adapter {
	
	protected _adapterName: string;
	protected _adapter: any;
	private _connectionName: string;
	protected _options: { [index: string]: any };
	
	// If a config is invalid, the overridden constructor is responsible for throwing an exception indicating the error.
	constructor(connectionName: string, config: {}) {
		this._connectionName = connectionName;
	}
	
	get adapterName(): string {
		return this._adapterName;
	}
	
	get adapter(): any {
		return this._adapter;
	}

	get connectionName(): string {
		return this._connectionName;
	}

	get options(): { [index: string]: any } {
		return this._options;
	}

}

export = Adapter;