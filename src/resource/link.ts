
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
    public fields: Field[] = [];
    private uriTemplate;

    constructor(rel: string, title: string, description: string, agent, accept, href, resolved, templated) {
        this.rel = rel;
        this.title = title;
        this.description = description;
        this.agent = agent;
        this.href = href;
        this.resolved = resolved;
        this.templated = templated;
        if (templated) {
            this.uriTemplate = new UriTemplate(this.href);
            this.fields = this.uriTemplate.varNames.map(name => ({
                name: name,
                type: 'text',
                title: this.title,
                description: this.description,
                required: true,
                example: null,
                value: null,
                multiple: false,
            }));
        }
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
