var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Joi = require('joi');
var Constants = require('../../config/constants');
var Adapter = require('./adapter');
var _defaultPostgresURL = process.env[Constants.EnvironmentVariables.postgres_url];
var PostgreSQL = (function (_super) {
    __extends(PostgreSQL, _super);
    function PostgreSQL(connectionName, config) {
        _super.call(this, connectionName, config);
        var validationResult = Joi.validate(config, PostgreSQL.schema);
        if (validationResult.error) {
            throw validationResult.error;
        }
        this._adapterName = 'postgres';
        this._adapter = this.shimAdapter();
        this._options = validationResult.value['options'];
    }
    PostgreSQL.prototype.shimAdapter = function () {
        var adapter = require('sails-postgresql');
        return adapter;
    };
    PostgreSQL.schema = Joi.object({
        type: Joi.string().valid('postgres'),
        options: Joi.object().required().keys({
            url: Joi.string().default(_defaultPostgresURL).uri({ scheme: 'postgres' }),
            pool: Joi.boolean().default(false),
            ssl: Joi.boolean().default(false)
        })
    });
    return PostgreSQL;
})(Adapter);
module.exports = PostgreSQL;
//# sourceMappingURL=postgresql.js.map