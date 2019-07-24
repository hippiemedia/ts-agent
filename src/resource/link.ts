
import Agent from '../agent';
import Resource from '../resource';
import {Field} from './operation';
import * as UriTemplate from 'uri-templates';

export default class Link
{
    private resolved: Resource | null;
    private agent: Agent;
    private accept: string;
    public readonly rel: string;
    public readonly title: string;
    public readonly description: string;
    public readonly href: string;
    public readonly templated: Boolean;
    public readonly deprecated: Boolean;
    public readonly extra: Object;
    public fields: Field[] = [];
    private uriTemplate;

    constructor(rel: string, title: string, description: string, agent, accept, href, resolved, templated, deprecated, extra = {}) {
        this.rel = rel;
        this.title = title || rel;
        this.description = description;
        this.agent = agent;
        this.accept = accept;
        this.href = href;
        this.resolved = resolved;
        this.deprecated = deprecated;
        this.extra = extra;
        this.uriTemplate = new UriTemplate(this.href);
        this.fields = this.uriTemplate.varNames.map(name => ({
            name: name,
            type: 'text',
            title: null,
            description: null,
            required: true,
            example: null,
            value: null,
            multiple: false,
        }));
        this.templated = this.fields.length > 0;
    }

    follow(fields = {}, force = false): Promise<Resource>
    {
        if (!force && this.resolved) {
            return Promise.resolve(this.resolved);
        }

        let href = this.templated ? this.uriTemplate.fill(fields) : this.href;

        return this.agent.call('GET', href, fields, {Accept: this.accept});
    }

    toString()
    {
        return this.rel;
    }

    isResolved() {
        return !!this.resolved;
    }
}
