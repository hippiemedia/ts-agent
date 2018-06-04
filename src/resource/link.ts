
import Agent from '../agent';
import Resource from '../resource';
import {Field} from './operation';
import * as parser from 'uri-template';

export default class Link
{
    private resolved: Resource | null;
    private agent: Agent;
    private accept: string;
    public readonly rel: string;
    public readonly href: string;
    public readonly templated: Boolean;
    public fields: Field[] = [];
    private uriTemplate;

    constructor(rel: string, agent, accept, href, resolved, templated) {
        this.rel = rel;
        this.agent = agent;
        this.href = decodeURI(href);
        this.resolved = resolved;
        this.templated = templated;
        if (templated) {
            this.uriTemplate = parser.parse(this.href);
            this.fields = this.uriTemplate.expressions.reduce((acc, e) => acc.concat(e.params.map(p => {return {name: p.name}})), []);
        }
    }

    follow(fields = {}): Promise<Resource>
    {
        if (this.resolved) {
            return Promise.resolve(this.resolved);
        }

        var href = this.templated ? this.uriTemplate.expand(fields) : this.href;

        return this.agent.call('GET', href, fields, {Accept: this.accept});
    }

    toString()
    {
        return this.rel;
    }
}
