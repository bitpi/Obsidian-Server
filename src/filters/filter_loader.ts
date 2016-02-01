/**
 * FilterLoader
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

import Filter = require('./filter');

import UserAuthenticationFilter = require('./user_authentication_filter');

export function loadFilter(name: string, options: any): Filter {

	switch (name) {
		case UserAuthenticationFilter.filterName: {
			return new UserAuthenticationFilter(options);
		}
	}

	let errorString = 'Unknown filter: `' + name + '`';
	throw new Error(errorString);

}