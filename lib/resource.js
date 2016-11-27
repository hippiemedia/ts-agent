
import {Operation} from './resource/operation';
import {Link} from './resource/link';
import {Query} from './resource/query';
import {Builder} from './resource/builder';
import _ from 'lodash';
import {Url} from 'url';

export class Resource
{
    constructor(agent, adapter, url, data, links, items, operations, queries, profiles) {
        this._agent = agent;
        this._adapter = adapter;
        this.url = url;
        this.data = data;
        this._links = links || [];
        this._items = items || [];
        this._operations = operations || [];
        this._queries = queries || [];
        this._profiles = profiles || [];
    }

    resolveUrl(path) {
        return url.resolve(this.url, path);
    }

    links() {
        return this._links.map(link => {
            return new Link(this, link.rel, this.resolveUrl(link.url));
        });
    }

    link(rel) {
        var link = _.find(this._links, _.matchesProperty('rel', rel))
            || (() => { throw Error(rel); })()
        ;

        return new Link(this, rel, this.resolveUrl(link.url));
    }

    items() {
        return this._items.map(item => {
            var builder = new Builder(this, this._adapter);
            builder.url(this.resolveUrl(item.url));
            this._adapter.fromObject(builder, item);

            return builder.build();
        });
    }

    queries() {
        return this._queries.map(query => {
            return new Query(this, query.rel, this.resolveUrl(query.url));
        });
    }

    query(rel) {
        var query = _.find(this._queries, _.matchesProperty('rel', rel))
            || (() => { throw Error(rel); })()
        ;

        return new Query(this, rel, this.resolveUrl(query.url));
    }

    operations() {
        return this._operations.map(operation => {
            return new Operation(this, operation.rel, this.resolveUrl(operation.url), operation.data);
        });
    }

    operation(rel) {
        var operation = _.find(this._operations, _.matchesProperty('rel', rel))
            || (() => { throw Error(rel); })()
        ;

        return new Operation(this, rel, operation.method, this.resolveUrl(operation.url), operation.data);
    }

    follow(url, params) {
        return this._agent.follow(this.resolveUrl(url), params, {
            'Accept': this._adapter.accepts()
        });
    }

    operate(method, url, params) {
        return this._agent.operate(method, this.resolveUrl(url), params, {
            'Accept': this._adapter.accepts()
        });
    }

    meaningOf(url) {
        return this._agent.follow(this.resolveUrl(url), {}, {});
    }
}
