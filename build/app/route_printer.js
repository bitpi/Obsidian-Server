var _ = require('lodash');
var Logger = require('./logger');
var Server = require('../api/server');
var ResourceMethod = require('../api/methods/resource_method');
function printRoutes(environment, resources, orm) {
    var server = new Server(environment, resources, orm);
    var routes = _.map(server.methods, function (method) {
        var response = {
            method: method.verb,
            path: '/' + method.name,
            resource: '/'
        };
        if (method instanceof ResourceMethod) {
            var resourceMethod = method;
            response.resource = '/' + resourceMethod.resource.name;
        }
        return response;
    });
    var groups = _.groupBy(routes, 'resource');
    _.each(groups, function (group) {
        Logger.hideLabels().info('').showLabels();
        var firstRoute = _.first(group);
        Logger.hideLabels().info('Resource `' + firstRoute.resource + '` exposes the following routes:').showLabels();
        var headers = ['Method', 'Resource', 'Path'];
        var rows = _.map(group, function (route) {
            return [route.method, route.resource, route.path];
        });
        Logger.hideLabels().table(headers, rows).showLabels();
    });
    Logger.hideLabels().info('').showLabels();
}
exports.printRoutes = printRoutes;
//# sourceMappingURL=route_printer.js.map