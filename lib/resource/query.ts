
import Agent from '../agent';
import Resource from '../resource';

export default class Query
{
    private agent: Agent;
    private rel: string;
    private url: string;

    constructor(agent, rel, url) {
        this.agent = agent;
        this.rel = rel;
        this.url = url;
    }

    by(data): Promise<Resource> {
        return this.agent.follow(this.url, data);
    }

    meaning(): Promise<Resource> {
        return this.agent.meaningOf(this.rel);
    }
}
