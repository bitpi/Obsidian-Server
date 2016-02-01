var Hapi = require('hapi');
var Boom = require('boom');
var Joi = require('joi');
var Promise = require('bluebird');
var Path = require('path');
var _ = require('lodash');
var Negotiator = require('negotiator');
var MessagePack = require('msgpack5')();
var Constants = require('../config/constants');
var Logger = require('../app/logger');
var Method = require('./methods/method');
var Request = require('./request');
var ErrorResponse = require('./responses/error_response');
var ResponseSerializer = require('./response_serializer');
var MetadataMethod = require('./methods/metadata_method');
var CreateMethod = require('./methods/create_method');
var ReadMethod = require('./methods/read_method');
var UpdateMethod = require('./methods/update_method');
var DestroyMethod = require('./methods/destroy_method');
var CustomMethod = require('./methods/custom_method');
var SupportedContentTypes = {
    'application/json': Constants.ContentType.JSON,
    'application/msgpack': Constants.ContentType.MessagePack
};
var _defaultPort = function () {
    var portString = process.env[Constants.EnvironmentVariables.port];
    if (portString)
        return parseInt(portString);
    else
        return Constants.DefaultPort;
}();
var Server = (function () {
    function Server(environment, resources, orm, authenticator) {
        this._methods = [];
        var validationResult = Joi.validate(environment.config, Server.validationSchema);
        if (validationResult.error) {
            throw validationResult.error;
        }
        this._authenticator = authenticator;
        this._customConfig = environment.custom;
        var serverConfig = validationResult.value['server'];
        this._server = new Hapi.Server();
        this._connectionOptions = {
            host: serverConfig['host'],
            port: serverConfig['port']
        };
        this._server.connection(this._connectionOptions);
        this.registerEndpoints(resources, orm);
    }
    Server.prototype.registerEndpoints = function (resources, orm) {
        var metadataMethod = new MetadataMethod(resources.metadata);
        this.registerMethod(metadataMethod);
        _.each(resources.resources, function (resource) {
            _.each(this.generateMethods(resource, orm), function (method) {
                this.registerMethod(method, resource.name);
            }, this);
        }, this);
        var catchallMethod = new Method('*', '\{p*}');
        this.registerMethod(catchallMethod);
    };
    Server.prototype.generateMethods = function (resource, orm) {
        var self = this;
        var model = orm.model(resource.name);
        var methods = _.map(resource.methodDescriptors, function (descriptor) {
            var type = descriptor.type;
            var method;
            switch (type) {
                case Constants.MethodType.Create: {
                    method = new CreateMethod(resource, descriptor, model);
                    break;
                }
                case Constants.MethodType.Read: {
                    method = new ReadMethod(resource, descriptor, model);
                    break;
                }
                case Constants.MethodType.Update: {
                    method = new UpdateMethod(resource, descriptor, model);
                    break;
                }
                case Constants.MethodType.Destroy: {
                    method = new DestroyMethod(resource, descriptor, model);
                    break;
                }
                case Constants.MethodType.Custom: {
                    method = new CustomMethod(resource, descriptor, model, orm.models, self._customConfig, descriptor.method, descriptor.modulePath);
                    break;
                }
            }
            if (method) {
                _.each(descriptor.filters, function (filter) {
                    filter.orm = orm;
                });
                method.filters = descriptor.filters;
            }
            return method;
        });
        _.each(resource.modules, function (m) {
            var customMethods = m.generateMethods(model, resource);
            methods = methods.concat(customMethods);
        });
        var filteredMethods = _.reject(methods, function (method) {
            return !method;
        });
        return filteredMethods;
    };
    Server.prototype.registerMethod = function (method, basePath) {
        if (basePath === void 0) { basePath = ''; }
        var self = this;
        var path = '/' + Path.join(basePath, method.name);
        var routeConfig = {
            path: path,
            method: method.verb,
            handler: function (request, reply) {
                self.handleRequest(method, request, reply);
            }
        };
        this._server.route(routeConfig);
        this._methods.push(method);
    };
    Server.prototype.handleRequest = function (method, hapiRequest, reply) {
        var self = this;
        var request = new Request();
        var respond = function (response) {
            self.respond(method, request, response, hapiRequest, reply);
        };
        request.headers = hapiRequest.headers;
        this.authenticateClient(request).bind(this).then(function (authenticated) {
            if (authenticated) {
                var params = {};
                _.merge(params, hapiRequest.params, hapiRequest.query, hapiRequest.payload);
                return self.validateParameters(params, method.validators());
            }
            else {
                var error = Boom.unauthorized();
                throw error;
            }
        }).then(function (params) {
            request.params = params;
            return method.transformRequest(request).then(function (req) {
                var filterPromises = _.map(method.filters, function (filter) {
                    return filter.before(req);
                });
                return Promise.all(filterPromises).then(function () {
                    return self.runMethod(method, req);
                });
            });
        }).then(function (response) {
            if (!(response instanceof ErrorResponse)) {
                method.transformResponse(response).then(function (res) {
                    respond(res);
                });
            }
            else {
                respond(response);
            }
        }).catch(function (error) {
            var response = new ErrorResponse(error);
            respond(response);
        });
    };
    Server.prototype.validateParameters = function (params, schemas) {
        return new Promise(function (fulfill, reject) {
            var reduced = _.reduce(schemas, function (newSchema, result) {
                return result.concat(newSchema);
            }, Joi.object());
            var result = Joi.validate(params, reduced);
            if (result.error)
                reject(result.error);
            else
                fulfill(result.value);
        });
    };
    Server.prototype.authenticateClient = function (request) {
        if (this._authenticator) {
            var clientKeyHeader = request.headers[Constants.AuthHeaders.clientKey];
            var clientSecretHeader = request.headers[Constants.AuthHeaders.clientSecret];
            return this._authenticator.authenticate(clientKeyHeader, clientSecretHeader);
        }
        else {
            return new Promise(function (fulfill, reject) { fulfill(true); });
        }
    };
    Server.prototype.runMethod = function (method, request) {
        return new Promise(function (fulfill, reject) {
            method.handle(request, fulfill);
        });
    };
    ;
    Server.prototype.respond = function (method, request, response, hapiRequest, reply) {
        var nodeRequest = hapiRequest.raw.req;
        var contentNegotiator = new Negotiator(nodeRequest);
        var availableTypes = _.keys(SupportedContentTypes);
        var candidates = contentNegotiator.mediaTypes(availableTypes);
        var contentTypeCandidate = candidates[0];
        var replyContentType = SupportedContentTypes[contentTypeCandidate];
        if (replyContentType != null) {
            var serializer = new ResponseSerializer(request, response);
            var responseObject = serializer.serialize();
            var responseData;
            switch (replyContentType) {
                case Constants.ContentType.JSON: {
                    responseData = responseObject;
                    break;
                }
                case Constants.ContentType.MessagePack: {
                    responseData = MessagePack.encode(responseObject);
                    break;
                }
            }
            var hapiResponse = reply(responseData);
            hapiResponse.type(contentTypeCandidate);
            hapiResponse.code(response.statusCode);
            _.each(response.responseHeaders, function (v, k) {
                hapiResponse.header(k, v);
            });
            var responseString = response.statusCode + ' ' + method.verb + ' ' + hapiRequest.path + ' (' + request.id + ')';
            Logger.http(responseString);
        }
        else {
            var empty = new Buffer(0);
            var hapiResponse = reply(empty);
            hapiResponse.code(Constants.HTTPStatusCode.NotAcceptable);
        }
    };
    Server.prototype.start = function () {
        var self = this;
        return new Promise(function (fulfill, reject) {
            self._server.start(function (err) {
                if (err)
                    reject(err);
                else {
                    Logger.info('Started server with options', self._connectionOptions);
                    fulfill(undefined);
                }
            });
        });
    };
    Server.prototype.stop = function () {
        var self = this;
        return new Promise(function (fulfill, reject) {
            self._server.stop(null, function () {
                fulfill(undefined);
            });
        });
    };
    Object.defineProperty(Server.prototype, "methods", {
        get: function () {
            return this._methods;
        },
        enumerable: true,
        configurable: true
    });
    Server.validationSchema = Joi.object({
        server: Joi.object({
            host: Joi.alternatives([Joi.string().hostname(), Joi.string().ip({})]).required(),
            port: Joi.number().default(_defaultPort).min(Constants.serverPorts.min).max(Constants.serverPorts.max)
        }).required()
    }).unknown().required();
    return Server;
})();
module.exports = Server;
//# sourceMappingURL=server.js.map