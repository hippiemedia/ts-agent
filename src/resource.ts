
import Operation from './resource/operation';
import Link from './resource/link';
import Query from './resource/query';
import * as _ from 'lodash';

export default class Resource
{
    public readonly contentType: string;
    public readonly url: string;
    public readonly links: Link[];
    public readonly items: Resource[];
    public readonly operations: Operation[];
    public readonly queries: Query[];

    constructor(url: string, contentType: string, links: Link[] = [], items: Resource[] = [], operations: Operation[] = [], queries: Query[] = []) {
        this.contentType = contentType;
        this.url = url;
        this.links = links;
        this.items = items;
        this.operations = operations;
        this.queries = queries;
    }

    link(rel) {
        return _.find(this.links, _.matchesProperty('rel', rel))
            || (() => { throw Error(rel); })()
        ;
    }

    query(rel) {
        return _.find(this.queries, _.matchesProperty('rel', rel))
            || (() => { throw Error(rel); })()
        ;
    }

    operation(rel) {
        return _.find(this.operations, _.matchesProperty('rel', rel))
            || (() => { throw Error(rel); })()
        ;
    }
}
