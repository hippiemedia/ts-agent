
import {Resource} from '../resource';
import _ from 'lodash';

export class Builder
{
    constructor(agent, adapter, url, data, links, items, operations, queries, profiles) {
        this.agent = agent;
        this.adapter = adapter;
        this._url = url;
        this._data = data;
        this._links = links || [];
        this._items = items || [];
        this._operations = operations || [];
        this._queries = queries || [];
        this._profiles = profiles || [];
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

    build() {
        return new Resource(
            this.agent, this.adapter, this._url,
            this._data, this._links, this._items, this._operations, this._queries, this._profiles
        );
    }
}
