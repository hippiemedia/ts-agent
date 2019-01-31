
import Agent from '../agent';
import Resource from '../resource';
import * as UriTemplate from 'uri-templates';

export type Field = {
    name: string,
    description: string,
    type: string,
    required: boolean,
    value: string,
    multiple: boolean,
    example: string,
};

export default class Operation
{
    private uriTemplate;
    private agent: Agent;
    private accept: string;
    public readonly rel: string;
    public readonly title: string;
    public readonly description: string;
    public readonly method: string;
    public readonly href: string;
    public readonly templated: Boolean;
    public fields: Field[];

    constructor(agent: Agent, rel: string, title: string, description: string, method: string, href: string, templated, accept: string, fields: Field[]) {
        this.agent = agent;
        this.rel = rel;
        this.title = title;
        this.description = description;
        this.method = method;
        this.href = href;
        this.accept = accept;
        this.fields = [];
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
        this.fields = this.fields.concat(fields.filter(newField => !this.fields.find(field => field.name == newField.name)));
    }

    submit(params): Promise<Resource> {
        let href = this.templated ? this.uriTemplate.fill(params) : this.href;

        return this.agent.call(this.method, href, params, {Accept: this.accept});
    }
}
