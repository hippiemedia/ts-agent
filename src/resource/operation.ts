
import Agent from '../agent';
import Resource from '../resource';

type Field = {
    name: string,
    type: string
};

export default class Operation
{
    private agent: Agent;
    private accept: string;
    public readonly rel: string;
    public readonly method: string;
    public readonly url: string;
    public fields: Field[];

    constructor(agent: Agent, rel: string, method: string, url: string, accept: string, fields) {
        this.agent = agent;
        this.rel = rel;
        this.method = method;
        this.url = url;
        this.accept = accept;
        this.fields = fields;
    }

    fill(fields) {
        this.fields = fields;
        return this;
    }

    submit(): Promise<Resource> {
        return this.agent.call(this.method, this.url, this.fields, {Accept: this.accept});
    }
}
