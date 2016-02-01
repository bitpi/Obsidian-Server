/**
 * UserAuthenticationAttributes
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */
import Chance = require('chance');

import StringHelpers = require('../../helpers/string_helpers');
import Attribute = require('../../api/attribute');

let _chance = new Chance();

function _randomToken(): string {
	return _chance.apple_token();
}

export let moduleName = 'user_authentication';

export let tokenAttribute = new Attribute(StringHelpers.prefixKey(moduleName, 'token'), {
	type: 'string',
	default: _randomToken,
	index: true,
	unique: true
});

export let passwordAttribute = new Attribute(StringHelpers.prefixKey(moduleName, 'password'), {
	type: 'string'
});

export let emailAttribute = new Attribute(StringHelpers.prefixKey(moduleName, 'email'), {
	type: 'string',
	index: true,
	unique: true
});

export let usernameAttribute = new Attribute(StringHelpers.prefixKey(moduleName, 'username'), {
	type: 'string',
	index: true,
	unique: true
});