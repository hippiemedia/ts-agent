
import Agent from '../agent';
import Resource from '../resource';

export default class Link
{
    private agent: Agent;
    private accept: string;
    public readonly rel: string;
    public readonly url: string;

    constructor(agent: Agent, rel: string, url: string, accept: string) {
        this.agent = agent;
        this.accept = accept;
        this.rel = rel;
        this.url = url;
    }

    follow(): Promise<Resource> {
        return this.agent.call('GET', this.url, {}, {Accept: this.accept});
    }
}
