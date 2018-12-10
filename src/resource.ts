
import Operation from './resource/operation';
import Link from './resource/link';
import Response from './client/response';

export default class Resource
{
    public readonly response: Response;
    public readonly url: string;
    public readonly operations: Operation[];
    public readonly state;
    public readonly links: Link[];

    constructor(response: Response, state, links: Link[] = [], operations: Operation[] = []) {
        this.response = response;
        this.url = response.url;
        this.state = state;
        this.links = links;
        this.operations = operations;
    }

    follow(rel, params = {}, force = false, criteria = () => true): Promise<Resource>
    {
        let link = this.links.filter(link => link.rel === rel).find(criteria);
        if (link) {
            return link.follow(params, force);
        }
        return Promise.reject(new Error(`no such link relation "${rel}" in "${this.links}"`));
    }

    followAll(rel, criteria = () => true): Promise<Resource>[]
    {
        return this.links.filter(link => link.rel === rel).filter(criteria).map(link => link.follow());
    }

    operation(rel)
    {
        return this.operations.find(link => link.rel === rel);
    }
}
