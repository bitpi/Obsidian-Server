var _ = require('lodash');
var Constants = require('../config/constants');
function filterKeys(object, keys) {
    if (_.isArray(object)) {
        var self_1 = this;
        return _.map(object, function (obj) {
            return self_1.filterKeys(obj, keys);
        });
    }
    else if (_.isObject(object)) {
        var result = _.omit(object, keys);
        return result;
    }
    else {
        return object;
    }
}
exports.filterKeys = filterKeys;
function filterQueryStringNulls(object) {
    if (_.isArray(object)) {
        var self_2 = this;
        return _.map(object, function (obj) {
            return self_2.filterQueryStringNulls(obj);
        });
    }
    else if (_.isObject(object)) {
        var self_3 = this;
        return _.mapValues(object, function (obj) {
            return self_3.filterQueryStringNulls(obj);
        });
    }
    else if (_.isString(object)) {
        return object == Constants.MagicNullString ? null : object;
    }
    else {
        return object;
    }
}
exports.filterQueryStringNulls = filterQueryStringNulls;
function mapToJSON(object) {
    if (_.isArray(object)) {
        return _.map(object, this.mapToJSON, this);
    }
    else if (_.isFunction(object.toJSON)) {
        return object.toJSON();
    }
    else {
        return object;
    }
}
exports.mapToJSON = mapToJSON;
//# sourceMappingURL=mapping_helpers.js.map