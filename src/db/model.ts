/**
 * Model
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Promise = require('bluebird');

import Logger = require('../app/logger');
import StringHelpers = require('../helpers/string_helpers');

class Model {
	 
	// Private members
	private _name: string;
	private _collection: any;
	 
	// Initialization
	constructor(name: string, collection: any) {
		this._name = name;
		this._collection = collection;
	}
	 
	// CRUD Methods
	create(body: {}): Promise<{}> {
		let self = this;
		
		let creator = this._collection.create(body);

		let promise = new Promise<{}>(function(fulfill, reject) {
			self.log('create', body);
			creator.exec(function(err, record) {
				if (err) reject(err);
				else fulfill(record);
			});
		});

		return promise;
	}

	read(criteria: {} = {}, sort: Array<string> = [], page: number = 0, limit: number = 1, include: Array<string> = []): Promise<Array<{}>> {
		let self = this;
		
		let finder = this._collection.find();

		finder.where(criteria);

		_.each(sort, function(descriptor) {
			finder.sort(descriptor);
		});

		finder.paginate({
			page: page,
			limit: limit
		});
		
		_.each(include, function(key) {
			finder.populate(key);
		});

		let promise = new Promise<Array<{}>>(function(fulfill, reject) {
			self.log('read', criteria);
			finder.exec(function(err, records) {
				if (err) reject(err);
				else fulfill(records);
			});
		});

		return promise;
	}

	update(criteria: {}, body: {}): Promise<Array<{}>> {
		let self = this;
		let updater = this._collection.update(criteria, body);
		let promise = new Promise<Array<{}>>(function(fulfill, reject) {
			updater.exec(function(err, records) {
				self.log('update', body);
				if (err) reject(err);
				else fulfill(records);
			});
		});
		return promise;
	}

	destroy(criteria: {}): Promise<Array<{}>> {
		let self = this;

		let destroyer = this._collection.destroy();

		destroyer.where(criteria);

		let promise = new Promise<Array<{}>>(function(fulfill, reject) {
			self.log('destroy', criteria);
			destroyer.exec(function(err, records) {
				if (err) reject(err);
				else fulfill(records);
			});
		});

		return promise;
	}

	// Logging
	private log(operation: string, meta?: any) {
		
		if (StringHelpers.startsWith(this.name, '_')) {
			return;
		}
		
		let message = operation + ' ' + this.name;
		Logger.db(message, meta);
	}

	// Accessors
	get name(): string {
		return this._name;
	}
	
}

export = Model;
 