exports.defaultDBAdapterName = 'primary';
exports.BuiltInResource = {
    metadata: '_metadata',
    client: '_client'
};
exports.EnvironmentVariables = {
    postgres_url: 'POSTGRES_URL',
    port: 'PORT'
};
exports.AuthHeaders = {
    clientKey: 'tendigi-client-key',
    clientSecret: 'tendigi-client-secret',
    bearerToken: 'tendigi-bearer-token'
};
exports.ResponseType = {
    error: 'error'
};
exports.DefaultPort = 8000;
exports.serverPorts = {
    min: 1,
    max: 65535
};
(function (MethodType) {
    MethodType[MethodType["Create"] = 0] = "Create";
    MethodType[MethodType["Read"] = 1] = "Read";
    MethodType[MethodType["Update"] = 2] = "Update";
    MethodType[MethodType["Destroy"] = 3] = "Destroy";
    MethodType[MethodType["Custom"] = 4] = "Custom";
})(exports.MethodType || (exports.MethodType = {}));
var MethodType = exports.MethodType;
;
exports.HTTPVerb = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
};
(function (ContentType) {
    ContentType[ContentType["JSON"] = 0] = "JSON";
    ContentType[ContentType["MessagePack"] = 1] = "MessagePack";
})(exports.ContentType || (exports.ContentType = {}));
var ContentType = exports.ContentType;
;
exports.MagicNullString = "__null__";
(function (HTTPStatusCode) {
    HTTPStatusCode[HTTPStatusCode["Continue"] = 100] = "Continue";
    HTTPStatusCode[HTTPStatusCode["SwitchingProtocols"] = 101] = "SwitchingProtocols";
    HTTPStatusCode[HTTPStatusCode["Processing"] = 102] = "Processing";
    HTTPStatusCode[HTTPStatusCode["Ok"] = 200] = "Ok";
    HTTPStatusCode[HTTPStatusCode["Created"] = 201] = "Created";
    HTTPStatusCode[HTTPStatusCode["Accepted"] = 202] = "Accepted";
    HTTPStatusCode[HTTPStatusCode["NonAuthoritativeInformation"] = 203] = "NonAuthoritativeInformation";
    HTTPStatusCode[HTTPStatusCode["NoContent"] = 204] = "NoContent";
    HTTPStatusCode[HTTPStatusCode["ResetContent"] = 205] = "ResetContent";
    HTTPStatusCode[HTTPStatusCode["PartialContent"] = 206] = "PartialContent";
    HTTPStatusCode[HTTPStatusCode["MultiStatus"] = 207] = "MultiStatus";
    HTTPStatusCode[HTTPStatusCode["MultipleChoices"] = 300] = "MultipleChoices";
    HTTPStatusCode[HTTPStatusCode["MovedPermanently"] = 301] = "MovedPermanently";
    HTTPStatusCode[HTTPStatusCode["MovedTemporarily"] = 302] = "MovedTemporarily";
    HTTPStatusCode[HTTPStatusCode["SeeOther"] = 303] = "SeeOther";
    HTTPStatusCode[HTTPStatusCode["NotModified"] = 304] = "NotModified";
    HTTPStatusCode[HTTPStatusCode["UseProxy"] = 305] = "UseProxy";
    HTTPStatusCode[HTTPStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HTTPStatusCode[HTTPStatusCode["BadRequest"] = 400] = "BadRequest";
    HTTPStatusCode[HTTPStatusCode["Unauthorized"] = 401] = "Unauthorized";
    HTTPStatusCode[HTTPStatusCode["PaymentRequired"] = 402] = "PaymentRequired";
    HTTPStatusCode[HTTPStatusCode["Forbidden"] = 403] = "Forbidden";
    HTTPStatusCode[HTTPStatusCode["NotFound"] = 404] = "NotFound";
    HTTPStatusCode[HTTPStatusCode["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HTTPStatusCode[HTTPStatusCode["NotAcceptable"] = 406] = "NotAcceptable";
    HTTPStatusCode[HTTPStatusCode["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HTTPStatusCode[HTTPStatusCode["RequestTimeOut"] = 408] = "RequestTimeOut";
    HTTPStatusCode[HTTPStatusCode["Conflict"] = 409] = "Conflict";
    HTTPStatusCode[HTTPStatusCode["Gone"] = 410] = "Gone";
    HTTPStatusCode[HTTPStatusCode["LengthRequired"] = 411] = "LengthRequired";
    HTTPStatusCode[HTTPStatusCode["PreconditionFailed"] = 412] = "PreconditionFailed";
    HTTPStatusCode[HTTPStatusCode["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
    HTTPStatusCode[HTTPStatusCode["RequestUriTooLarge"] = 414] = "RequestUriTooLarge";
    HTTPStatusCode[HTTPStatusCode["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    HTTPStatusCode[HTTPStatusCode["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
    HTTPStatusCode[HTTPStatusCode["ExpectationFailed"] = 417] = "ExpectationFailed";
    HTTPStatusCode[HTTPStatusCode["ImATeapot"] = 418] = "ImATeapot";
    HTTPStatusCode[HTTPStatusCode["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    HTTPStatusCode[HTTPStatusCode["Locked"] = 423] = "Locked";
    HTTPStatusCode[HTTPStatusCode["FailedDependency"] = 424] = "FailedDependency";
    HTTPStatusCode[HTTPStatusCode["UnorderedCollection"] = 425] = "UnorderedCollection";
    HTTPStatusCode[HTTPStatusCode["UpgradeRequired"] = 426] = "UpgradeRequired";
    HTTPStatusCode[HTTPStatusCode["PreconditionRequired"] = 428] = "PreconditionRequired";
    HTTPStatusCode[HTTPStatusCode["TooManyRequests"] = 429] = "TooManyRequests";
    HTTPStatusCode[HTTPStatusCode["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
    HTTPStatusCode[HTTPStatusCode["InternalServerError"] = 500] = "InternalServerError";
    HTTPStatusCode[HTTPStatusCode["NotImplemented"] = 501] = "NotImplemented";
    HTTPStatusCode[HTTPStatusCode["BadGateway"] = 502] = "BadGateway";
    HTTPStatusCode[HTTPStatusCode["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HTTPStatusCode[HTTPStatusCode["GatewayTimeOut"] = 504] = "GatewayTimeOut";
    HTTPStatusCode[HTTPStatusCode["HttpVersionNotSupported"] = 505] = "HttpVersionNotSupported";
    HTTPStatusCode[HTTPStatusCode["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
    HTTPStatusCode[HTTPStatusCode["InsufficientStorage"] = 507] = "InsufficientStorage";
    HTTPStatusCode[HTTPStatusCode["BandwidthLimitExceeded"] = 509] = "BandwidthLimitExceeded";
    HTTPStatusCode[HTTPStatusCode["NotExtended"] = 510] = "NotExtended";
    HTTPStatusCode[HTTPStatusCode["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
})(exports.HTTPStatusCode || (exports.HTTPStatusCode = {}));
var HTTPStatusCode = exports.HTTPStatusCode;
exports.exitFailure = -1;
require('pkginfo')(module, 'version');
exports.version = module.exports.version;
//# sourceMappingURL=constants.js.map