var _ = require('lodash');
var Promise = require('bluebird');
var Logger = require('../app/logger');
var StringHelpers = require('../helpers/string_helpers');
var Model = (function () {
    function Model(name, collection) {
        this._name = name;
        this._collection = collection;
    }
    Model.prototype.create = function (body) {
        var self = this;
        var creator = this._collection.create(body);
        var promise = new Promise(function (fulfill, reject) {
            self.log('create', body);
            creator.exec(function (err, record) {
                if (err)
                    reject(err);
                else
                    fulfill(record);
            });
        });
        return promise;
    };
    Model.prototype.read = function (criteria, sort, page, limit, include) {
        if (criteria === void 0) { criteria = {}; }
        if (sort === void 0) { sort = []; }
        if (page === void 0) { page = 0; }
        if (limit === void 0) { limit = 1; }
        if (include === void 0) { include = []; }
        var self = this;
        var finder = this._collection.find();
        finder.where(criteria);
        _.each(sort, function (descriptor) {
            finder.sort(descriptor);
        });
        finder.paginate({
            page: page,
            limit: limit
        });
        _.each(include, function (key) {
            finder.populate(key);
        });
        var promise = new Promise(function (fulfill, reject) {
            self.log('read', criteria);
            finder.exec(function (err, records) {
                if (err)
                    reject(err);
                else
                    fulfill(records);
            });
        });
        return promise;
    };
    Model.prototype.update = function (criteria, body) {
        var self = this;
        var updater = this._collection.update(criteria, body);
        var promise = new Promise(function (fulfill, reject) {
            updater.exec(function (err, records) {
                self.log('update', body);
                if (err)
                    reject(err);
                else
                    fulfill(records);
            });
        });
        return promise;
    };
    Model.prototype.destroy = function (criteria) {
        var self = this;
        var destroyer = this._collection.destroy();
        destroyer.where(criteria);
        var promise = new Promise(function (fulfill, reject) {
            self.log('destroy', criteria);
            destroyer.exec(function (err, records) {
                if (err)
                    reject(err);
                else
                    fulfill(records);
            });
        });
        return promise;
    };
    Model.prototype.log = function (operation, meta) {
        if (StringHelpers.startsWith(this.name, '_')) {
            return;
        }
        var message = operation + ' ' + this.name;
        Logger.db(message, meta);
    };
    Object.defineProperty(Model.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return Model;
})();
module.exports = Model;
//# sourceMappingURL=model.js.map