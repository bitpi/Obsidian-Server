var _ = require('lodash');
var Promise = require('bluebird');
var Waterline = require('waterline');
var RelationshipType = require('../api/relationship_type');
var Model = require('./model');
var MigrationStrategy = require('./migration_strategy');
var ORM = (function () {
    function ORM(resources, databases, strategy) {
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
        var models = this.generateModels(resources);
        _.each(models, function (model) {
            this._waterline.loadCollection(model);
        }, this);
    }
    ORM.prototype.generateConfig = function (databases) {
        var adapters = {};
        var connections = {};
        _.each(databases, function (adapter) {
            adapters[adapter.adapterName] = adapter.adapter;
            connections[adapter.connectionName] = _.extend({ adapter: adapter.adapterName }, adapter.options);
        });
        return {
            adapters: adapters,
            connections: connections,
            defaults: this._defaults
        };
    };
    ORM.prototype.generateModels = function (resources) {
        var models = _.map(resources, function (resource) {
            var resourceIdentity = resource.name.toLowerCase();
            var attributes = {};
            _.each(resource.attributes, function (attribute) {
                attributes[attribute.name] = {
                    type: attribute.dbType,
                    defaultsTo: attribute.defaultValue
                };
                if (attribute.index) {
                    attributes[attribute.name]['index'] = true;
                }
                if (attribute.unique) {
                    attributes[attribute.name]['unique'] = true;
                }
            });
            _.each(resource.relationships, function (relationship) {
                var targetResourceName = relationship.resourceName.toLowerCase();
                var association;
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
            var coll = Waterline.Collection.extend({
                identity: resourceIdentity,
                connection: resource.connection,
                attributes: attributes
            });
            return coll;
        });
        return models;
    };
    ORM.prototype.connect = function () {
        var self = this;
        var promise = new Promise(function (fulfill, reject) {
            self._waterline.initialize(self._config, function (err, result) {
                if (err)
                    reject(err);
                else {
                    self._models = _.mapValues(result.collections, function (collection, name) {
                        return new Model(name, collection);
                    });
                    fulfill(undefined);
                }
            });
        });
        return promise;
    };
    ORM.prototype.disconnect = function () {
        var self = this;
        return new Promise(function (fulfill, reject) {
            self._waterline.teardown(function (error) {
                if (error) {
                    reject(error);
                }
                else {
                    fulfill(undefined);
                }
            });
        });
    };
    Object.defineProperty(ORM.prototype, "models", {
        get: function () {
            return this._models;
        },
        enumerable: true,
        configurable: true
    });
    ORM.prototype.model = function (name) {
        var key = name.toLowerCase();
        return this.models[key];
    };
    return ORM;
})();
module.exports = ORM;
//# sourceMappingURL=orm.js.map