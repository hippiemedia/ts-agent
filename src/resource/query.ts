
import Agent from '../agent';
import Resource from '../resource';

export default class Query
{
    private agent: Agent;
    private accept: string;
    public readonly rel: string;
    public readonly url: string;

    constructor(rel: string, agent: Agent, url, accept) {
        this.rel = rel;
        this.agent = agent;
        this.url = url;
        this.accept = accept;
    }

    by(data): Promise<Resource> {
        return this.agent.call('GET', this.url, data, {Accept: this.accept});
    }
}
