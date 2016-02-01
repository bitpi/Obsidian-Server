/**
 * ORM
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Promise = require('bluebird');
var Waterline = require('waterline');

import Resource = require('../api/resource');
import RelationshipType = require('../api/relationship_type');
import Model = require('./model');
import DB = require('./db');
import MigrationStrategy = require('./migration_strategy');

interface Defaults {
	migrate: string;
}

class ORM {

	// Private members
	private _waterline: any;
	private _defaults: Defaults;
	private _config: {};
	private _models: { [index: string]: Model }

	// Initialization
	constructor(resources: Array<Resource>, databases: DB.Container, strategy: MigrationStrategy) {

		this._waterline = new Waterline();
		
		this._defaults = {
			migrate: 'safe'	
		};
		
		switch (strategy) {
			case MigrationStrategy.Alter: {
				this._defaults.migrate = 'alter';
				break;
			}
			case MigrationStrategy.Create: {
				this._defaults.migrate = 'create';
				break;
			}
			case MigrationStrategy.Drop: {
				this._defaults.migrate = 'drop';
				break;
			}	
		} 
		
		this._config = this.generateConfig(databases);

		let models = this.generateModels(resources);

		_.each(models, function(model) {
			this._waterline.loadCollection(model)
		}, this);

	}
	
	// Config
	private generateConfig(databases: DB.Container): {} {
		let adapters = {};
		let connections = {};

		_.each(databases, function(adapter) {
			adapters[adapter.adapterName] = adapter.adapter;
			connections[adapter.connectionName] = _.extend({ adapter: adapter.adapterName }, adapter.options);
		});

		return {
			adapters: adapters,
			connections: connections,
			defaults: this._defaults
		};
	}

	private generateModels(resources: Array<Resource>): Array<{}> {

		let models = _.map(resources, function(resource) {
			
			let resourceIdentity = resource.name.toLowerCase(); // needs to be lower case, per Waterline docs

			let attributes = {};
			
			
			// Configure the attributes
			_.each(resource.attributes, function(attribute) {
				
				attributes[attribute.name] = {
					type: attribute.dbType,
					defaultsTo: attribute.defaultValue
				};
				
				// undefined, null, and false all cause an index to be created
				// so we have to go with this solution for now
				if (attribute.index) {
					attributes[attribute.name]['index'] = true;
				}
				
				// Same with the unique field
				if (attribute.unique) {
					attributes[attribute.name]['unique'] = true;
				}

			});

			// Configure the relationships
			_.each(resource.relationships, function(relationship) {
				
				let targetResourceName = relationship.resourceName.toLowerCase(); // has to be lower case
				
				let association: {};
				
				switch (relationship.type) {
					case RelationshipType.HasOne: {
						
						association = {
							model: targetResourceName
						};
						
						if (relationship.targetRelationshipName) {
							association['via'] = relationship.targetRelationshipName;
						}
						
						break;
					}
					case RelationshipType.HasMany: {
						
						association = {
							collection: targetResourceName
						};
						
						if (relationship.targetRelationshipName) {
							association['via'] = relationship.targetRelationshipName;
						}
						
						break;
					}
				}
				
				attributes[relationship.name] = association;
				
			});
	
			// Finally, return the configured collection
			let coll =  Waterline.Collection.extend({
				identity: resourceIdentity,
				connection: resource.connection,
				attributes: attributes
			});

			return coll;

		});

		return models;

	}
	
	// Connection
	connect(): Promise<void> {
		let self = this;
		let promise = new Promise<void>(function(fulfill, reject) {
			self._waterline.initialize(self._config, function(err, result) {
				if (err) reject(err);
				else {
					self._models = _.mapValues(result.collections, function(collection, name) {
						return new Model(name, collection);
					});
					fulfill(undefined);
				}
			});
		});
		return promise;
	}

	disconnect(): Promise<void> {
		let self = this;
		return new Promise<void>(function(fulfill, reject) {
			self._waterline.teardown(function(error) {
				if (error) {
					reject(error);
				}
				else {
					fulfill(undefined);
				}
			});
		});
	}
	
	// Accessors
	
	get models(): { [index: string]: Model } {
		return this._models;
	}

	model(name: string): Model {
		let key = name.toLowerCase();
		return this.models[key];
	}

}

export = ORM;