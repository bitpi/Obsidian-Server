var Moment = require('moment');
var Constants = require('../../config/constants');
var MappingHelpers = require('../../helpers/mapping_helpers');
function _decodeResponse(object) {
    return MappingHelpers.mapToJSON(object);
}
var Response = (function () {
    function Response(type, responseObject, statusCode) {
        if (responseObject === void 0) { responseObject = null; }
        if (statusCode === void 0) { statusCode = Constants.HTTPStatusCode.Ok; }
        this._responseObject = null;
        this._responseHeaders = {};
        this._statusCode = statusCode;
        this._type = type;
        this._responseObject = _decodeResponse(responseObject);
        this._date = Moment().toDate();
    }
    Response.prototype.addResponseHeader = function (name, value) {
        this._responseHeaders[name] = value;
    };
    Object.defineProperty(Response.prototype, "statusCode", {
        get: function () {
            return this._statusCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "responseObject", {
        get: function () {
            return this._responseObject;
        },
        set: function (responseObject) {
            this._responseObject = _decodeResponse(responseObject);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "responseHeaders", {
        get: function () {
            return this._responseHeaders;
        },
        enumerable: true,
        configurable: true
    });
    return Response;
})();
module.exports = Response;
//# sourceMappingURL=response.js.map