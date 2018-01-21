
import Agent from '../agent';
import Resource from '../resource';

export interface Link
{
    readonly rel: string;

    follow(): Promise<Resource>;

    followAll(): Promise<Resource[]>;
}

export class Unresolved implements Link
{
    private agent: Agent;
    private accept: string;
    public readonly rel: string;
    public readonly urls: string[];

    constructor(agent: Agent, rel: string, urls: string[], accept: string) {
        this.agent = agent;
        this.accept = accept;
        this.rel = rel;
        this.urls = urls;
    }

    follow(): Promise<Resource> {
        return this.agent.call('GET', this.urls[0], {}, {Accept: this.accept});
    }

    followAll(): Promise<Resource[]> {
        return Promise.all(this.urls.map(url => {
            return this.agent.call('GET', url, {}, {Accept: this.accept});
        }));
    }
}

export class Resolved implements Link
{
    public readonly rel: string;
    public readonly resources: Resource[];

    constructor(rel: string, resources: Resource[]) {
        this.rel = rel;
        this.resources = resources;
    }

    follow(): Promise<Resource> {
        return Promise.resolve(this.resources[0]);
    }

    followAll(): Promise<Resource[]> {
        return Promise.resolve(this.resources);
    }
}
