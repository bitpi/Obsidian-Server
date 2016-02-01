/**
 * DateHelpers
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

import Moment = require('moment');

export function format(date: Date): string {
	let moment = Moment(date);
	return moment.toISOString();
}