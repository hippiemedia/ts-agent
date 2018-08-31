
import Operation from './resource/operation';
import Link from './resource/link';
import {Collection as LinkCollection} from './resource/link/collection';
import {Collection as TemplateCollection} from './resource/template/collection';
import Response from './client/response';

export default class Resource
{
    public readonly response: Response;
    public readonly url: string;
    public readonly links: LinkCollection;
    public readonly templates: TemplateCollection;
    public readonly operations: Operation[];
    public readonly state;

    constructor(response: Response, state, links: Link[] = [], templates: Link[] = [], operations: Operation[] = []) {
        this.response = response;
        this.url = response.url;
        this.state = state;
        this.links = new LinkCollection(links);
        this.templates = new TemplateCollection(templates);
        this.operations = operations;
    }

    operation(rel)
    {
        return this.operations.find(link => link.rel === rel);
    }
}
