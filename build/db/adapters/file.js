var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Joi = require('joi');
var Untildify = require('untildify');
var Adapter = require('./adapter');
var File = (function (_super) {
    __extends(File, _super);
    function File(connectionName, config) {
        _super.call(this, connectionName, config);
        var validationResult = Joi.validate(config, File.schema);
        if (validationResult.error) {
            throw validationResult.error;
        }
        this._adapterName = 'file';
        this._adapter = this.shimAdapter();
        var path = Untildify(validationResult.value['options']['directory']);
        this._options = {
            filePath: path,
            schema: true
        };
    }
    File.prototype.shimAdapter = function () {
        var adapter = require('sails-disk');
        return adapter;
    };
    File.schema = Joi.object({
        type: Joi.string().valid('file'),
        options: Joi.object().required().keys({
            directory: Joi.string().min(1).required()
        })
    });
    return File;
})(Adapter);
module.exports = File;
//# sourceMappingURL=file.js.map