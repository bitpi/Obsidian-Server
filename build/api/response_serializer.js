var DateHelpers = require('../helpers/date_helpers');
var ResponseSerializer = (function () {
    function ResponseSerializer(request, response) {
        this._request = request;
        this._response = response;
    }
    ResponseSerializer.prototype.serialize = function () {
        var response = {
            _type: this._response.type,
            _requestID: this._request.id,
            _requestTimestamp: DateHelpers.format(this._request.date),
            _responseTimestamp: DateHelpers.format(this._response.date),
            _data: this._response.responseObject
        };
        return response;
    };
    return ResponseSerializer;
})();
module.exports = ResponseSerializer;
//# sourceMappingURL=response_serializer.js.map