/**
 * RoutePrinter
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import _ = require('lodash');
import Logger = require('./logger');
import Environment = require('../config/environment');
import Resources = require('../config/resources');
import ORM = require('../db/orm');
import Server = require('../api/server');
import Method = require('../api/methods/method');
import ResourceMethod = require('../api/methods/resource_method');

export function printRoutes(environment: Environment, resources: Resources, orm: ORM) {

	let server = new Server(environment, resources, orm);
 
	let routes = _.map(server.methods, function(method) {

		let response = {
			method: method.verb,
			path: '/' + method.name,
			resource: '/'
		};

		if (method instanceof ResourceMethod) {
			let resourceMethod = <ResourceMethod>method;
			response.resource = '/' + resourceMethod.resource.name;
		}

		return response;

	});

	let groups = _.groupBy(routes, 'resource');

	_.each(groups, function(group) {

		Logger.hideLabels().info('').showLabels();
		
		let firstRoute = _.first(group);
		Logger.hideLabels().info('Resource `' + firstRoute.resource + '` exposes the following routes:').showLabels();

		let headers = ['Method', 'Resource', 'Path'];

		let rows = _.map(group, function(route) {
			return [route.method, route.resource, route.path];
		});

		Logger.hideLabels().table(headers, rows).showLabels();

	});

	Logger.hideLabels().info('').showLabels();

}