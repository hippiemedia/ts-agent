
import linkFormat from 'h5.linkformat';
import Builder from './resource/builder';
import Resource from './resource';
import Adapter from './adapter';
import Response from './client/response';

export default class Agent
{
    private adapters: Adapter[];
    private client: Function;

    constructor(adapters: Adapter[], client: Function) {
        this.adapters = adapters;
        this.client = client;
    }

    follow(url, params = {}, headers = {}) {
        return this.call('get', url, params, headers);
    }

    meaningOf(rel, params = {}, headers = {}) {
        return this.call('get', rel, params, headers);
    }

    operate(method, url, params = {}, headers = {}) {
        return this.call(method, url, params, headers);
    }

    call(method, url, params, headers): Promise<Resource> {
        return this.client(method, url, params, headers)
            .then(this.build.bind(this))
        ;
    }

    getAdapter(type): Adapter {
        return this.adapters.find(adapter => {
            return adapter.supports(type);
        }) || (() => { throw Error(type); })();
    }

    build(response: Response): Resource {
        var type = response.xhr.getResponseHeader('Content-Type') || '';
        var adapter = this.getAdapter(type);
        var builder = new Builder(this, response.url);

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
