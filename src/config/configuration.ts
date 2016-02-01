/**
 * Configuration
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */
 
import Promise = require('bluebird');
import FS = require('fs'); 
import Joi = require('joi');
 
type Callback = (error?: any) => void;

class Configuration {
	
	// Private Members
	private _validatedObject: {};
	private _path: string;
	private _readFile: ((filename: string) => Promise<Buffer>) = Promise.promisify<Buffer, string>(FS.readFile);
	private _parseJSON: ((buffer: Buffer) => Promise<{}>) = Promise.promisify<{}, Buffer>(function(buf, cb) {
		try { cb(null, JSON.parse(buf.toString())); } catch(e) { cb(e, null); }
	});
	private _validateJSON: ((json: {}) => Promise<void>) = Promise.promisify<void, {}>(this.runValidation);
	
	// Initialization
	constructor(path: string) {
		this._path = path;
	}
	
	// Loading/Validation
	load(callback?: Callback) {
		this._readFile(this._path).then(this._parseJSON).then(this._validateJSON.bind(this)).then(function(){
			if (callback) {
				callback(null);
			}
		}).catch(function(error){
			if (callback) {
				callback(error);
			}
		});
	}
	
	private runValidation(json: {}, callback?: (err?: any) => void) {
		try {
			this.validate(json)
			if (callback) {
				callback(null);
			}
		}
		catch (err) {
			if (callback) {
				callback(err);
			}
		}
	}

	protected validate(json: {}) {
		this._validatedObject = json;
		return null;
	}
	
	// Data Access
	get(key: string): {} {
		return this._validatedObject[key];	
	}

}

export = Configuration;