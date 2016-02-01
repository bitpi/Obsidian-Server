var Chance = require('chance');
var Moment = require('moment');
var Request = (function () {
    function Request() {
        this._id = Request.chance.guid();
        this._date = Moment().toDate();
    }
    Object.defineProperty(Request.prototype, "headers", {
        get: function () {
            return this._headers;
        },
        set: function (headers) {
            this._headers = headers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Request.prototype, "params", {
        get: function () {
            return this._params;
        },
        set: function (params) {
            this._params = params;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Request.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Request.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: true,
        configurable: true
    });
    Request.chance = new Chance();
    return Request;
})();
module.exports = Request;
//# sourceMappingURL=request.js.map