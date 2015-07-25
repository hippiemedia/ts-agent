
import core from 'core-js';
import linkFormat from 'h5.linkformat';
import {Builder} from './resource/builder';

export class Router
{
    constructor(adapters, client) {
        this.adapters = adapters.map(adapter => {
            adapter.router = this;
            return adapter;
        });
        this.client = client;
    }

    follow(url, params, headers) {
        return this._call('get', url, params, headers);
    }

    operate(method, url, params, headers) {
        return this._call(method, url, params, headers);
    }

    _call(method, url, params, headers) {
        return this.client(method, url, params, headers)
            .then(this.build.bind(this))
            .catch(console.error.bind(console))
        ;
    }

    getAdapter(type) {
        return this.adapters.find(adapter => {
            return adapter.supports(type);
        }) || (() => { throw Error(type); })();
    }

    build(response) {
        var type = response.xhr.getResponseHeader('Content-Type') || '';
        var adapter = this.getAdapter(type);
        var builder = new Builder(this, adapter);
        builder.url(response.url);

        if (-1 !== response.xhr.getAllResponseHeaders().indexOf('Link')) {
            var link = response.xhr.getResponseHeader('Link') || '';
            linkFormat.parse(link).filter(link => {
                builder.links(link);
                return link.rel === 'profile';
            }).forEach(link => {
                builder.profiles(link);
            });
            linkFormat.parse(type).filter(link, rel => {
                return rel === 'profile';
            }).forEach(link => {
                builder.profiles(link);
            });
        }

        adapter.build(builder, response.xhr.responseText);

        return builder.build();
    }
}
