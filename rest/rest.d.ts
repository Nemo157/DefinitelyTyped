// Type definitions for rest.js v1.2.0
// Project: https://github.com/cujojs/rest
// Definitions by: Wim Looman <https://github.com/Nemo157>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../when/when.d.ts" />

declare module "rest" {
	import * as when from "when";

	function rest(path: string): ResponsePromise;
	function rest(request: Request): ResponsePromise;

	module rest {
		export function setDefaultClient(client: Client): void;
		export function getDefaultClient(): Client;
		export function resetDefaultClient(): void;

		export function wrap<T>(interceptor: Interceptor<T>, config?: T): Client;
	}

	export default rest;

	export interface Request {
		method?: string;
		path?: string;
		params?: any;
		headers?: any;
		entity?: any;
	}

	export interface Status {
		code: number;
		text?: string;
	}

	export interface Headers {
		[index: string]: any // string or string[]
	}

	export interface Response {
		request: Request;
		raw: any;
		status: Status;
		headers: Headers;
		entity: any;
	}

	export interface ResponsePromise extends when.Promise<Response> {
		entity(): when.Promise<any>;
		status(): when.Promise<number>;
		headers(): when.Promise<Headers>;
		header(headerName: string): when.Promise<any>; // string or string[]
	}

	export interface Interceptor<T> {
		(parent?: Client, config?: T): Client;
	}

	export interface Client {
		(path: string): ResponsePromise;
		(request: Request): ResponsePromise;

		skip(): Client;
		wrap<T>(interceptor: Interceptor<T>, config?: T): Client;
	}

	export interface Meta {
		client: Client;
		arguments: any;
	}
}

declare module "rest/interceptor" {
	import * as when from "when";
	import * as rest from "rest";

	function interceptor<T, U>(config: Config<T, U>): rest.Interceptor<T>;

	export interface Config<T, U> {
		init?: (config: T) => U;
		request?: (request: rest.Request, config: U, meta: rest.Meta) => rest.Request | when.Promise<rest.Request>;
		response?: (response: rest.Response, config: U, meta: rest.Meta) => rest.Response | when.Promise<rest.Response>;
		success?: (response: rest.Response, config: U, meta: rest.Meta) => rest.Response | when.Promise<rest.Response>;
		error?: (response: rest.Response, config: U, meta: rest.Meta) => rest.Response | when.Promise<rest.Response>;
	}

	export default interceptor;
}

declare module "rest/interceptor/defaultRequest" {
	import * as rest from "rest";

	var defaultRequest: rest.Interceptor<Config>;

	export interface Config {
		method?: string;
		path?: string;
		params?: any;
		headers?: any;
		entity?: any;
		mixin?: any;
	}

	export default defaultRequest;
}

declare module "rest/interceptor/hateoas" {
	import * as rest from "rest";

	var hateoas: rest.Interceptor<Config>;

	export interface Config {
		target?: string;
		client?: rest.Client;
	}

	export default hateoas;
}

declare module "rest/interceptor/location" {
	import * as rest from "rest";

	var location: rest.Interceptor<Config>;

	export interface Config {
		client?: rest.Client;
		code?: number;
	}

	export default location;
}

declare module "rest/interceptor/mime" {
	import * as rest from "rest";
	import * as registry from "rest/mime/registry";

	var mime: rest.Interceptor<Config>;

	export interface Config {
		mime?: string;
		accept?: string;
		registry?: registry.Registry;
		permissive?: boolean;
	}

	export default mime;
}

declare module "rest/interceptor/pathPrefix" {
	import * as rest from "rest";

	var pathPrefix: rest.Interceptor<Config>;

	export interface Config {
		prefix?: string;
	}

	export default pathPrefix;
}

declare module "rest/interceptor/basicAuth" {
	import * as rest from "rest";

	var basicAuth: rest.Interceptor<Config>;

	export interface Config {
		username?: string;
		password?: string;
	}

	export default basicAuth;
}

declare module "rest/interceptor/oAuth" {
	import * as rest from "rest";

	var oAuth: rest.Interceptor<Config>;

	export interface DismissWindow {
		(): void;
	}

	export interface Config {
		token?: string;
		clientId?: string;
		scope?: string;
		authorizationUrl?: string;
		redirectUrl?: string;
		windowStrategy?: (url: string) => DismissWindow;
		oAuthCallback?: (hash: string) => void;
		oAuthCallbackName?: string;
	}

	export default oAuth;
}

declare module "rest/interceptor/csrf" {
	import * as rest from "rest";

	var csrf: rest.Interceptor<Config>;

	export interface Config {
		name?: string;
		token?: string;
	}

	export default csrf;
}

declare module "rest/interceptor/errorCode" {
	import * as rest from "rest";

	var errorCode: rest.Interceptor<Config>;

	export interface Config {
		code?: number;
	}

	export default errorCode;
}

declare module "rest/interceptor/retry" {
	import * as rest from "rest";

	var retry: rest.Interceptor<Config>;

	export interface Config {
		initial?: number;
		multiplier?: number;
		max?: number;
	}

	export default retry;
}

declare module "rest/interceptor/timeout" {
	import * as rest from "rest";

	var timeout: rest.Interceptor<Config>;

	export interface Config {
		timeout?: number;
		transient?: boolean;
	}

	export default timeout;
}

declare module "rest/interceptor/jsonp" {
	import * as rest from "rest";

	var jsonp: rest.Interceptor<Config>;

	export interface Config {
		callback?: {
			param?: string;
			prefix?: string;
			name?: string;
		}
	}

	export default jsonp;
}

declare module "rest/interceptor/ie/xdomain" {
	import * as rest from "rest";

	var xdomain: rest.Interceptor<{}>;

	export default xdomain;
}

declare module "rest/interceptor/ie/xhr" {
	import * as rest from "rest";

	var xhr: rest.Interceptor<{}>;

	export default xhr;
}

declare module "rest/mime/registry" {
	import * as when from "when";

	var registry: Registry;

	export interface MIMEConverter {
		read(value: string): any | when.Promise<any>;
		write(value: any): string | when.Promise<string>;
	}

	export interface Registry {
		lookup(mimeType: string): when.Promise<MIMEConverter>;
		register(mimeType: string, converter: MIMEConverter): void;
	}

	export default registry;
}

declare module "rest/client/xhr" {
	import * as rest from "rest";
	var xhr: rest.Client;
	export default xhr;
}

declare module "rest/client/node" {
	import * as rest from "rest";
	var node: rest.Client;
	export default node;
}

declare module "rest/client/jsonp" {
	import * as rest from "rest";
	var jsonp: rest.Client;
	export default jsonp;
}

declare module "rest/client/xdr" {
	import * as rest from "rest";
	var xdr: rest.Client;
	export default xdr;
}
