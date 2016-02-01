/**
 * Authenticator
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Promise = require('bluebird');

import Constants = require('../config/constants');
import Resource = require('./resource');
import ORM = require('../db/orm');
import Model = require('../db/model');

class Authenticator {
	 
	// Private members
	static resourceConfig = {
		attributes: {
			name: {
				type: "string"
			},
			key: {
				type: "string",
				index: true
			},
			secret: {
				type: "string",
				index: true
			}
		}
	};

	private _resource: Resource;
	private _orm: ORM;
	 
	// Initialization
	constructor() {
		this._resource = new Resource(Constants.BuiltInResource.client, Authenticator.resourceConfig, true);
	}
	 
	// Authentication
	authenticate(key: string, secret: string): Promise<boolean> {
		let self = this;
		return new Promise<boolean>(function(fulfill, reject) {

			if (_.isEmpty(key) || _.isEmpty(secret)) {
				fulfill(false);
			}
			else if (self.orm) {
				let Client = self.model;
				if (Client) {

					let criteria = {
						key: key,
						secret: secret
					};

					Client.read(criteria, null, null, 1).then(function(records) {
						fulfill(!_.isEmpty(records));
					}).catch(reject);

				}
				else {
					let error = new Error('Authenticator error: Client model not found on ORM.');
					reject(error);
				}
			}
			else {
				let error = new Error('Authenticator error: ORM not set.');
				reject(error);
			}
		});
	}
	
	// Client management
	createClient(name: string, key: string, secret: string): Promise<{}> {
		return this.model.create({
			name: name,
			key: key,
			secret: secret
		});
	}

	listClients(): Promise<Array<{}>> {
		return this.model.read({}, null, null, 0);
	}

	deleteClient(key: string): Promise<boolean> {
		let self = this;
		return new Promise<boolean>(function(fulfill, reject) {
			self.model.destroy({
				key: key
			}).then(function(deleted) {
				fulfill(!_.isEmpty(deleted));
			}).catch(reject);
		});
	}
	
	// Accessors
	get resource(): Resource {
		return this._resource;
	}

	get orm(): ORM {
		return this._orm;
	}

	set orm(orm: ORM) {
		this._orm = orm;
	}

	private get model(): Model {
		return this.orm.model(Constants.BuiltInResource.client);
	}
}

export = Authenticator;