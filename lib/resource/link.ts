
import Agent from '../agent';
import Resource from '../resource';

export default class Link
{
    private agent: Agent;
    private rel: string;
    private url: string;

    constructor(agent: Agent, rel: string, url: string) {
        this.agent = agent;
        this.rel = rel;
        this.url = url;
    }

    follow(): Promise<Resource> {
        return this.agent.follow(this.url);
    }

    meaning(): Promise<Resource> {
        return this.agent.meaningOf(this.rel);
    }
}
