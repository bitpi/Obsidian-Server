/**
 * StringHelpers
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */
 
 import _ = require('lodash');
 
 import Constants = require('../config/constants'); 
 
 export function filterKeys(object: any, keys: Array<string>): any {
	 if (_.isArray(object)) {
		 let self = this;
		 return _.map(object, function(obj) {
			 return self.filterKeys(obj, keys);
		 });
	 }
	 else if (_.isObject(object)) {
		 let result = _.omit(object, keys);
		 return result;
	 }
	 else {
		 return object;
	 }
 }
 
  export function filterQueryStringNulls(object: any): any {
	 if (_.isArray(object)) {
		 let self = this;
		 return _.map(object, function(obj) {
			 return self.filterQueryStringNulls(obj);
		 });
	 }
	 else if (_.isObject(object)) {
		 let self = this;
		 return _.mapValues(object, function(obj) {
			 return self.filterQueryStringNulls(obj);
		 });
	 }
	 else if (_.isString(object)) {
		 return object == Constants.MagicNullString ? null : object;
	 }
	 else {
		 return object;
	 }
 }
 
 export function mapToJSON(object: any): any {
	 if (_.isArray(object)) {
		 return _.map(object, this.mapToJSON, this);
	 }
	 else if (_.isFunction(object.toJSON)) {
		 return object.toJSON();
	 }
	 else {
		 return object;
	 }
 }