
import Agent from '../agent';
import Resource from '../resource';

export default class Query
{
    private agent: Agent;
    private accept: string;
    public readonly rel: string;
    public readonly url: string;

    constructor(agent: Agent, rel, url, accept) {
        this.agent = agent;
        this.rel = rel;
        this.url = url;
        this.accept = accept;
    }

    by(data): Promise<Resource> {
        return this.agent.call('GET', this.url, data, {Accept: this.accept});
    }
}
