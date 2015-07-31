/// <reference path="./rest.d.ts" />

import when from 'when';
import rest from 'rest';

import defaultRequest from 'rest/interceptor/defaultRequest';
import hateoas from 'rest/interceptor/hateoas';
import location from 'rest/interceptor/location';
import mime from 'rest/interceptor/mime';
import pathPrefix from 'rest/interceptor/pathPrefix';
import basicAuth from 'rest/interceptor/basicAuth';
import oAuth from 'rest/interceptor/oAuth';
import csrf from 'rest/interceptor/csrf';
import errorCode from 'rest/interceptor/errorCode';
import retry from 'rest/interceptor/retry';
import timeout from 'rest/interceptor/timeout';
import jsonp from 'rest/interceptor/jsonp';
import xdomain from 'rest/interceptor/ie/xdomain';
import xhr from 'rest/interceptor/ie/xhr';

import interceptor from 'rest/interceptor';
import registry from 'rest/mime/registry';

rest('/').then(function(response) {
    console.log('response: ', response);
});


var client = rest.wrap(mime);
client({ path: '/data.json' }).then(function(response) {
    console.log('response: ', response);
});

client = rest.wrap<mime.Config>(mime, { mime: 'application/json' }).wrap(errorCode, { code: 500 });
client({ path: '/data.json' }).then(
    function(response) {
        console.log('response: ', response);
    },
    function(response) {
        console.error('response error: ', response);
    }
);

registry.register('application/vnd.com.example', {
    read: function(str: string) {
        var obj: any;
        // do string to object conversions
        return obj;
    },
    write: function(obj: any) {
        var str: string;
        // do object to string conversions
        return str;
    }
});

var noop = interceptor({
    init: (config: any) => {
        return config;
    },
    request: (request: rest.Request, config: any, meta: rest.Meta) => {
        return request;
    },
    response: (response: rest.Response, config: any, meta: rest.Meta) => {
        return response;
    },
    success: (response: rest.Response, config: any, meta: rest.Meta) => {
        return response;
    },
    error: (response: rest.Response, config: any, meta: rest.Meta) => {
        return response;
    }
});

var fail = interceptor({
    success: (response: rest.Response) => when.reject<rest.Response>(response),
});

var succeed = interceptor({
    error: (response: rest.Response) => when(response),
});

var defaulted = interceptor({
    init: (config: any) => {
        config.prop = config.prop || 'default-value';
        return config;
    },
});

interface KnownConfig {
    prop: string;
}
var knownConfig = interceptor({
    success: (response: rest.Response, config: KnownConfig) => {
        console.log(config);
        return response;
    },
});

var transformedConfig = interceptor({
    init: (config: KnownConfig) => {
        return config.prop;
    },
    success: (response: rest.Response, config: string) => {
        console.log(config);
        return response;
    },
});

var promiseOrResponse = interceptor({
    success: (response: rest.Response) => {
        return response;
    },
    error: (response: rest.Response) => {
        return when(response);
    },
});

client = rest
    .wrap(defaultRequest)
    .wrap(hateoas)
    .wrap(location)
    .wrap(mime)
    .wrap(pathPrefix)
    .wrap(basicAuth)
    .wrap(oAuth)
    .wrap(csrf)
    .wrap(errorCode)
    .wrap(retry)
    .wrap(timeout)
    .wrap(jsonp)
    .wrap(xdomain)
    .wrap(xhr)
    .wrap(noop)
    .wrap(fail)
    .wrap(knownConfig, { prop: 'value' })
    .wrap(transformedConfig, { prop: 'value' });

import xhrClient from 'rest/client/xhr';
import nodeClient from 'rest/client/node';
import jsonpClient from 'rest/client/jsonp';
import xdrClient from 'rest/client/xdr';

rest.setDefaultClient(xhrClient);
rest.setDefaultClient(nodeClient);
rest.setDefaultClient(jsonpClient);
rest.setDefaultClient(xdrClient);

var defaultClient: rest.Client = rest.getDefaultClient();

rest.resetDefaultClient();
