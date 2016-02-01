var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Constants = require('../../config/constants');
var Method = require('./method');
var Response = require('../responses/response');
var MetadataMethod = (function (_super) {
    __extends(MetadataMethod, _super);
    function MetadataMethod(metadata) {
        _super.call(this, Constants.HTTPVerb.GET, Constants.BuiltInResource.metadata);
        this._metadata = metadata;
    }
    MetadataMethod.prototype.handle = function (request, callback) {
        var data = {
            name: this._metadata.name,
            version: this._metadata.version
        };
        var response = new Response('metadata', data);
        callback(response);
    };
    return MetadataMethod;
})(Method);
module.exports = MetadataMethod;
//# sourceMappingURL=metadata_method.js.map