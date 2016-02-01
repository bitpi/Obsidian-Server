var _ = require('lodash');
var Promise = require('bluebird');
var Chance = require('chance');
var Prompt = require('prompt');
var Logger = require('./logger');
var _chance = new Chance();
function _pick(client) {
    return _.pick(client, ['name', 'key', 'secret']);
}
function _createClient(authenticator, name, key, secret) {
    return new Promise(function (fulfill, reject) {
        Logger.hideLabels().info('').showLabels();
        Logger.info('Creating client...');
        authenticator.createClient(name, key, secret).then(function (client) {
            var picked = _pick(client);
            Logger.info('Client created successfully', picked, true);
            Logger.hideLabels().info('').showLabels();
            fulfill(undefined);
        }).catch(reject);
    });
}
function _deleteClient(authenticator, key) {
    Logger.hideLabels().info('').showLabels();
    Logger.info('Removing client...');
    return authenticator.deleteClient(key).then(function (success) {
        if (success) {
            Logger.info('Client removed successfully', null, true);
        }
        else {
            Logger.info('Failed to remove client', null, true);
        }
        Logger.hideLabels().info('').showLabels();
    });
}
;
function _startPrompt() {
    Prompt.message = '';
    Prompt.delimiter = '';
    Logger.hideLabels().info('').showLabels();
    Prompt.start();
}
function list(authenticator) {
    return authenticator.listClients().then(function (clients) {
        Logger.hideLabels().info('').showLabels();
        Logger.info('Fetching client list...');
        if (_.isEmpty(clients)) {
            Logger.info('No clients found.', null, true);
        }
        else {
            var mapped = _.map(clients, _pick);
            _.each(mapped, function (client, i) {
                var label = 'Client ' + i;
                Logger.info('', client, true);
            });
        }
        Logger.hideLabels().info('').showLabels();
    });
}
exports.list = list;
function create(authenticator) {
    return new Promise(function (fulfill, reject) {
        _startPrompt();
        var schema = {
            properties: {
                name: {
                    description: 'Client Name:',
                    required: true
                },
                key: {
                    description: 'Client Key:',
                    required: true,
                    default: _chance.apple_token()
                },
                secret: {
                    description: 'Client Secret:',
                    required: true,
                    default: _chance.apple_token()
                }
            }
        };
        Prompt.get(schema, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                var name_1 = result['name'];
                var key = result['key'];
                var secret = result['secret'];
                _createClient(authenticator, name_1, key, secret).then(fulfill).catch(reject);
            }
        });
    });
}
exports.create = create;
function destroy(authenticator) {
    return new Promise(function (fulfill, reject) {
        _startPrompt();
        var schema = {
            properties: {
                key: {
                    description: 'Client key to delete:',
                    required: true
                }
            }
        };
        Prompt.get(schema, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                var key = result['key'];
                _deleteClient(authenticator, key).then(fulfill).catch(reject);
            }
        });
    });
}
exports.destroy = destroy;
//# sourceMappingURL=client_manager.js.map