/**
 * StringHelpers
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */

export function prefixKey(prefix: string, key: string): string {
	return prefix + '_' + key;
}

export function startsWith(str: string, prefix: string): boolean {
    return str.indexOf(prefix) === 0;
}