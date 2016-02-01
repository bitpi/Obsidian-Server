var Promise = require('bluebird');
var Filter = (function () {
    function Filter() {
    }
    Filter.prototype.before = function (request) {
        return new Promise(function (fulfill, reject) {
            fulfill(undefined);
        });
    };
    Filter.prototype.after = function (request) {
        return new Promise(function (fulfill, reject) {
            fulfill(undefined);
        });
    };
    Object.defineProperty(Filter.prototype, "orm", {
        get: function () {
            return this._orm;
        },
        set: function (orm) {
            this._orm = orm;
        },
        enumerable: true,
        configurable: true
    });
    return Filter;
})();
module.exports = Filter;
//# sourceMappingURL=filter.js.map