/**
 * Relationship
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */
 
 import _ = require('lodash');
 import Joi = require('joi');
 
 import Resource = require('./resource');
 import RelationshipType = require('./relationship_type');
 
 class Relationship {
	 
	 // Private 
	 private static typeMap = {
		 has_one: RelationshipType.HasOne,
		 has_many: RelationshipType.HasMany
	 };
	 
	 private static validationSchema = Joi.object({
		resource: Joi.string().min(1).alphanum().required(),
		type: Joi.string().valid(_.keys(Relationship.typeMap)).required(),
		target_relationship: Joi.string().min(1).alphanum().optional()
	 });
	 
	 private _name: string;
	 private _resourceName: string;
	 private _type: RelationshipType;
	 private _targetRelationshipName: string; 
	 
	 // Initialization
	 constructor(name: string, config: {}) {
		 
		 this._name = name;
		 
		 let validationResult = Joi.validate(config, Relationship.validationSchema)
		 
		 if (validationResult.error) {
			 throw validationResult.error;
		 } 
		 
		 let validated = validationResult.value;
		 
		 this._type = Relationship.typeMap[validated['type']];
		 this._resourceName = validated['resource'];
		 this._targetRelationshipName = validated['target_relationship'];
		 
	 }
	 
	 // Accessors
	 get name(): string {
		 return this._name;
	 }
	 
	 get resourceName(): string {
		 return this._resourceName;
	 }
	 
	 get type(): RelationshipType {
		 return this._type;
	 }
	 
	 get targetRelationshipName(): string {
		 return this._targetRelationshipName;
	 }
	 
 }
 
 export = Relationship;