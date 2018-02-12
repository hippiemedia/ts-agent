
import Agent from '../agent';
import Resource from '../resource';

export default class Link
{
    public readonly rel: string;
    private resolved: Map<string, Resource>;
    private agent: Agent;
    private accept: string;
    private urls: string[];

    constructor(rel: string, agent, accept, urls, resolved) {
        this.rel = rel;
        this.agent = agent;
        this.urls = urls;
        this.resolved = resolved;
    }

    follow(): Promise<Resource>
    {
        return this.pick(this.urls[0]);
    }

    followAll()
    {
        return Promise.all(this.urls.map(this.pick.bind(this)));
    }

    private pick(url) {
        if (this.resolved.has(url)) {
            return Promise.resolve(this.resolved.get(url));
        }

        return this.agent.call('GET', url, {}, {Accept: this.accept});
    }
}
