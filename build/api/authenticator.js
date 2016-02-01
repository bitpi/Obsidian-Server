var _ = require('lodash');
var Promise = require('bluebird');
var Constants = require('../config/constants');
var Resource = require('./resource');
var Authenticator = (function () {
    function Authenticator() {
        this._resource = new Resource(Constants.BuiltInResource.client, Authenticator.resourceConfig, true);
    }
    Authenticator.prototype.authenticate = function (key, secret) {
        var self = this;
        return new Promise(function (fulfill, reject) {
            if (_.isEmpty(key) || _.isEmpty(secret)) {
                fulfill(false);
            }
            else if (self.orm) {
                var Client = self.model;
                if (Client) {
                    var criteria = {
                        key: key,
                        secret: secret
                    };
                    Client.read(criteria, null, null, 1).then(function (records) {
                        fulfill(!_.isEmpty(records));
                    }).catch(reject);
                }
                else {
                    var error = new Error('Authenticator error: Client model not found on ORM.');
                    reject(error);
                }
            }
            else {
                var error = new Error('Authenticator error: ORM not set.');
                reject(error);
            }
        });
    };
    Authenticator.prototype.createClient = function (name, key, secret) {
        return this.model.create({
            name: name,
            key: key,
            secret: secret
        });
    };
    Authenticator.prototype.listClients = function () {
        return this.model.read({}, null, null, 0);
    };
    Authenticator.prototype.deleteClient = function (key) {
        var self = this;
        return new Promise(function (fulfill, reject) {
            self.model.destroy({
                key: key
            }).then(function (deleted) {
                fulfill(!_.isEmpty(deleted));
            }).catch(reject);
        });
    };
    Object.defineProperty(Authenticator.prototype, "resource", {
        get: function () {
            return this._resource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Authenticator.prototype, "orm", {
        get: function () {
            return this._orm;
        },
        set: function (orm) {
            this._orm = orm;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Authenticator.prototype, "model", {
        get: function () {
            return this.orm.model(Constants.BuiltInResource.client);
        },
        enumerable: true,
        configurable: true
    });
    Authenticator.resourceConfig = {
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
    return Authenticator;
})();
module.exports = Authenticator;
//# sourceMappingURL=authenticator.js.map