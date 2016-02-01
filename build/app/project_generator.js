var Path = require('path');
var FS = require('fs');
var Promise = require('bluebird');
var Sanitizer = require('sanitize-filename');
var Prompt = require('prompt');
var Untildify = require('untildify');
var Logger = require('./logger');
function environmentGenerator() {
    return {
        config: {
            server: {
                host: '0.0.0.0',
                port: 8000
            },
            db: {
                type: 'file',
                options: {
                    directory: './db/'
                }
            }
        },
        modules: {},
        custom: {}
    };
}
function _resourcesGenerator(name) {
    return {
        metadata: {
            name: name,
            version: '0.0.1'
        },
        resources: {}
    };
}
var promptSchema = {
    properties: {
        name: {
            description: 'Project Name:',
            required: true
        },
        location: {
            description: 'Project Location:',
            required: true,
            default: './'
        }
    }
};
function generate() {
    return new Promise(function (fulfill, reject) {
        Prompt.message = '';
        Prompt.delimiter = '';
        Logger.hideLabels().info('').showLabels();
        Prompt.start();
        Prompt.get(promptSchema, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                _generate(result.name, result.location);
                fulfill(undefined);
            }
        });
    });
}
exports.generate = generate;
function _sanitize(name) {
    var sanitized = Sanitizer(name);
    sanitized = sanitized.replace(/\s/g, '-');
    sanitized = sanitized.replace(/[^\w-]/g, '');
    while (true) {
        var newString = sanitized.replace(/-+/g, '-');
        if (sanitized == newString) {
            break;
        }
        sanitized = newString;
    }
    return sanitized.toLowerCase();
}
function _mkdir(path) {
    try {
        FS.mkdirSync(path);
    }
    catch (e) {
        if (e.code != 'EEXIST')
            throw e;
    }
}
function _writeJSON(path, json) {
    var jsonString = JSON.stringify(json, null, 2);
    FS.writeFileSync(path, jsonString);
}
function _generate(name, location) {
    Logger.info('Creating project directory...');
    var sanitizedName = _sanitize(name);
    var folder = Untildify(Path.join(location, sanitizedName));
    _mkdir(folder);
    Logger.info('Creating database directory...');
    var dbFolder = Path.join(folder, 'db');
    _mkdir(dbFolder);
    Logger.info('Creating environment.json...');
    var environment = environmentGenerator();
    var environmentPath = Path.join(folder, 'environment.json');
    _writeJSON(environmentPath, environment);
    Logger.info('Creating resources.json...');
    var resources = _resourcesGenerator(name);
    var resourcePath = Path.join(folder, 'resources.json');
    _writeJSON(resourcePath, resources);
}
//# sourceMappingURL=project_generator.js.map