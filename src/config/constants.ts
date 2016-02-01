/**
 * Constants
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */

export let defaultDBAdapterName: string = 'primary';

export let BuiltInResource = {
	metadata: '_metadata',
	client: '_client'
};

export let EnvironmentVariables = {
	postgres_url: 'POSTGRES_URL',
	port: 'PORT'
};

export let AuthHeaders = {
	clientKey: 'tendigi-client-key',
	clientSecret: 'tendigi-client-secret',
	bearerToken: 'tendigi-bearer-token'
};

export let ResponseType = {
	error: 'error'
};

export let DefaultPort = 8000;

export let serverPorts = {
	min: 1,
	max: 65535
};

export enum MethodType {
	Create,
	Read,
	Update,
	Destroy,
	Custom
};

export let HTTPVerb = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE'
};

export enum ContentType {
	JSON,
	MessagePack	
};

export let MagicNullString = "__null__";

export enum HTTPStatusCode {
	Continue = 100,
	SwitchingProtocols = 101,
	Processing = 102,
	Ok = 200,
	Created = 201,
	Accepted = 202,
	NonAuthoritativeInformation = 203,
	NoContent = 204,
	ResetContent = 205,
	PartialContent = 206,
	MultiStatus = 207,
	MultipleChoices = 300,
	MovedPermanently = 301,
	MovedTemporarily = 302,
	SeeOther = 303,
	NotModified = 304,
	UseProxy = 305,
	TemporaryRedirect = 307,
	BadRequest = 400,
	Unauthorized = 401,
	PaymentRequired = 402,
	Forbidden = 403,
	NotFound = 404,
	MethodNotAllowed = 405,
	NotAcceptable = 406,
	ProxyAuthenticationRequired = 407,
	RequestTimeOut = 408,
	Conflict = 409,
	Gone = 410,
	LengthRequired = 411,
	PreconditionFailed = 412,
	RequestEntityTooLarge = 413,
	RequestUriTooLarge = 414,
	UnsupportedMediaType = 415,
	RequestedRangeNotSatisfiable = 416,
	ExpectationFailed = 417,
	ImATeapot = 418,
	UnprocessableEntity = 422,
	Locked = 423,
	FailedDependency = 424,
	UnorderedCollection = 425,
	UpgradeRequired = 426,
	PreconditionRequired = 428,
	TooManyRequests = 429,
	RequestHeaderFieldsTooLarge = 431,
	InternalServerError = 500,
	NotImplemented = 501,
	BadGateway = 502,
	ServiceUnavailable = 503,
	GatewayTimeOut = 504,
	HttpVersionNotSupported = 505,
	VariantAlsoNegotiates = 506,
	InsufficientStorage = 507,
	BandwidthLimitExceeded = 509,
	NotExtended = 510,
	NetworkAuthenticationRequired = 511
}

export let exitFailure = -1;

require('pkginfo')(module, 'version');
export let version: string = module.exports.version;