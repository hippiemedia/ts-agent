
import Resource from '../resource';
import Adapter from '../adapter';
import Agent from '../agent';
import Operation from './operation';
import Link from './link';
import Query from './query';
import * as _ from 'lodash';
import {resolve} from 'url';

export default class Builder
{
    private agent: Agent;
    private adapter: Adapter;
    private _url: string;
    private _data;
    private _links: any[] = [];
    private _items: any[] = [];
    private _operations: any[] = [];
    private _queries: any[] = [];
    private _profiles: any[] = [];

    constructor(agent: Agent, adapter: Adapter) {
        this.agent = agent;
        this.adapter = adapter;
    }

    resolveUrl(path) {
        return resolve(this._url, path);
    }

    url(url) {
        this._url = url;
        return this;
    }

    data(data) {
        this._data = data;
        return this;
    }

    links(links) {
        this._links = this._links.concat([].concat(links).filter(_.negate(_.isEmpty)));
        return this;
    }

    items(items) {
        this._items = this._items.concat([].concat(items).filter(_.negate(_.isEmpty)));
        return this;
    }

    operations(operations) {
        this._operations = this._operations.concat([].concat(operations).filter(_.negate(_.isEmpty)));
        return this;
    }

    queries(queries) {
        this._queries = this._queries.concat([].concat(queries)).filter(_.negate(_.isEmpty));
        return this;
    }

    profiles(profiles) {
        this._profiles = this._profiles.concat([].concat(profiles).filter(_.negate(_.isEmpty)));
        return this;
    }

    build(): Resource {
        return new Resource(
            this._url,
            this._data,
            this._links.map(link => {
                return new Link(this.agent, link.rel, this.resolveUrl(link.url));
            }),
            this._items.map(item => {
                var builder = new Builder(this.agent, this.adapter);
                builder.url(this.resolveUrl(item.url));
                this.adapter.fromObject(builder, item);

                return builder.build();
            }),
            this._operations.map(operation => {
                return new Operation(this.agent, operation.rel, operation.method, this.resolveUrl(operation.url), operation.data);
            }),
            this._queries.map(query => {
                return new Query(this.agent, query.rel, this.resolveUrl(query.url));
            }),
            this._profiles
        );
    }
}
