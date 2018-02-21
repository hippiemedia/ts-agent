
import Agent from '../agent';
import Resource from '../resource';

export default class Operation
{
    private agent: Agent;
    private rel: string;
    private method: string;
    private url: string;
    private data: any;

    constructor(agent: Agent, rel: string, method: string, url: string, data) {
        this.agent = agent;
        this.rel = rel;
        this.method = method;
        this.url = url;
        this.data = data;
    }

    fill(data) {
        this.data = data;
    }

    submit(): Promise<Resource> {
        return this.agent.operate(this.method, this.url, this.data);
    }

    meaning(): Promise<Resource> {
        return this.agent.meaningOf(this.rel);
    }
}
