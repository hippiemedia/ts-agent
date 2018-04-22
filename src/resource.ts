
import Operation from './resource/operation';
import Link from './resource/link';

export default class Resource
{
    public readonly contentType: string;
    public readonly url: string;
    public readonly allLinks: Link[];
    public readonly operations: Operation[];
    public readonly state;

    constructor(url: string, state, contentType: string, links: Link[] = [], operations: Operation[] = []) {
        this.url = url;
        this.state = state;
        this.contentType = contentType;
        this.allLinks = links;
        this.operations = operations;
    }

    follow(rel, fields = {}, criteria = () => true): Promise<Resource>
    {
        let link = this.links(rel).find(criteria);
        if (link) {
            return link.follow(fields);
        }
        return Promise.reject(new Error(`no such link relation "${rel}" in "${this.allLinks}"`));
    }

    followAll(rel, fields = {}, criteria = () => true): Promise<Resource>[]
    {
        return this.links(rel).filter(criteria).map(link  => link.follow(fields));
    }

    links(rel)
    {
        return this.allLinks.filter(link => link.rel === rel);
    }

    operation(rel)
    {
        return this.operations.find(link => link.rel === rel);
    }
}
