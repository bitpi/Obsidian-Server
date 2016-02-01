var Chance = require('chance');
var StringHelpers = require('../../helpers/string_helpers');
var Attribute = require('../../api/attribute');
var _chance = new Chance();
function _randomToken() {
    return _chance.apple_token();
}
exports.moduleName = 'user_authentication';
exports.tokenAttribute = new Attribute(StringHelpers.prefixKey(exports.moduleName, 'token'), {
    type: 'string',
    default: _randomToken,
    index: true,
    unique: true
});
exports.passwordAttribute = new Attribute(StringHelpers.prefixKey(exports.moduleName, 'password'), {
    type: 'string'
});
exports.emailAttribute = new Attribute(StringHelpers.prefixKey(exports.moduleName, 'email'), {
    type: 'string',
    index: true,
    unique: true
});
exports.usernameAttribute = new Attribute(StringHelpers.prefixKey(exports.moduleName, 'username'), {
    type: 'string',
    index: true,
    unique: true
});
//# sourceMappingURL=user_authentication_attributes.js.map