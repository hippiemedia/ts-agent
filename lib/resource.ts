
import Operation from './resource/operation';
import Link from './resource/link';
import Query from './resource/query';
import Builder from './resource/builder';
import * as _ from 'lodash';

export default class Resource
{
    private _url: string;
    private _data;
    private _links: Link[];
    private _items: Resource[];
    private _operations: Operation[];
    private _queries: Query[];
    private _profiles: Resource[];

    constructor(url: string, data, links: Link[], items: Resource[], operations: Operation[], queries: Query[], profiles) {
        this._url = url;
        this._data = data;
        this._links = links || [];
        this._items = items || [];
        this._operations = operations || [];
        this._queries = queries || [];
        this._profiles = profiles || [];
    }

    links() {
        return this._links;
    }

    link(rel) {
        return _.find(this._links, _.matchesProperty('rel', rel))
            || (() => { throw Error(rel); })()
        ;
    }

    items() {
        return this._items;
    }

    queries() {
        return this._queries;
    }

    query(rel) {
        return _.find(this._queries, _.matchesProperty('rel', rel))
            || (() => { throw Error(rel); })()
        ;
    }

    operations() {
        return this._operations;
    }

    operation(rel) {
        return _.find(this._operations, _.matchesProperty('rel', rel))
            || (() => { throw Error(rel); })()
        ;
    }
}
