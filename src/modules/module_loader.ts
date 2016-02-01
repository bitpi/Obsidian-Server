/**
 * ModuleLoader
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Module = require('./module');

import UserAuthentication = require('./user_authentication/user_authentication');

export function loadModule(name: string, options: any): Module {

	switch (name) {
		case UserAuthentication.moduleName: {
			return new UserAuthentication(options);
		}
	}

	let errorString = 'Unknown module: `' + name + '`';
	throw new Error(errorString);

}