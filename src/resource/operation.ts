
import Agent from '../agent';
import Resource from '../resource';

export type Field = {
    name: string,
    type: string,
    required: boolean,
    value: string,
};

export default class Operation
{
    private agent: Agent;
    private accept: string;
    public readonly rel: string;
    public readonly method: string;
    public readonly href: string;
    public fields: Field[];

    constructor(agent: Agent, rel: string, method: string, href: string, accept: string, fields: Field[]) {
        this.agent = agent;
        this.rel = rel;
        this.method = method;
        this.href = href;
        this.accept = accept;
        this.fields = fields;
    }

    fill(fields: Field[]) {
        this.fields = fields;
        return this;
    }

    submit(): Promise<Resource> {
        return this.agent.call(this.method, this.href, this.fields, {Accept: this.accept});
    }
}
