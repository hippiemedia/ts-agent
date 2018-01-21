
import Agent from '../agent';
import Resource from '../resource';

export default class Operation
{
    private agent: Agent;
    private accept: string;
    public readonly rel: string;
    public readonly method: string;
    public readonly url: string;
    public data: any;

    constructor(agent: Agent, rel: string, method: string, url: string, accept: string, data?) {
        this.agent = agent;
        this.rel = rel;
        this.method = method;
        this.url = url;
        this.accept = accept;
        this.data = data;
    }

    fill(data) {
        this.data = data;
    }

    submit(): Promise<Resource> {
        return this.agent.call(this.method, this.url, this.data, {Accept: this.accept});
    }

}
