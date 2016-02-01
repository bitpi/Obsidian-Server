var Promise = require('bluebird');
var FS = require('fs');
var Configuration = (function () {
    function Configuration(path) {
        this._readFile = Promise.promisify(FS.readFile);
        this._parseJSON = Promise.promisify(function (buf, cb) {
            try {
                cb(null, JSON.parse(buf.toString()));
            }
            catch (e) {
                cb(e, null);
            }
        });
        this._validateJSON = Promise.promisify(this.runValidation);
        this._path = path;
    }
    Configuration.prototype.load = function (callback) {
        this._readFile(this._path).then(this._parseJSON).then(this._validateJSON.bind(this)).then(function () {
            if (callback) {
                callback(null);
            }
        }).catch(function (error) {
            if (callback) {
                callback(error);
            }
        });
    };
    Configuration.prototype.runValidation = function (json, callback) {
        try {
            this.validate(json);
            if (callback) {
                callback(null);
            }
        }
        catch (err) {
            if (callback) {
                callback(err);
            }
        }
    };
    Configuration.prototype.validate = function (json) {
        this._validatedObject = json;
        return null;
    };
    Configuration.prototype.get = function (key) {
        return this._validatedObject[key];
    };
    return Configuration;
})();
module.exports = Configuration;
//# sourceMappingURL=configuration.js.map