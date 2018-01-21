
import Resource from './resource';
import Adapter from './adapter';
import Response from './client/response';
import {Client} from './client';

export default class Agent
{
    private adapters: Adapter[];
    private client: Function;

    constructor(adapters: Adapter[], client: Function) {
        this.adapters = adapters;
        this.client = client;
    }

    follow(url: string): Promise<Resource> {
        return this.call('get', url, {}, {Accept: this.accept('')});
    }

    async call(method, url, params, headers = {}): Promise<Resource> {
        let response = await this.client(method, url, params, headers);

        return this.build(url, response);
    }

    private getAdapter(type): Adapter {
        return this.adapters.find(adapter => {
            return adapter.supports(type);
        }) || (() => { throw Error(type); })();
    }

    private accept(contentType): string {
        return this.adapters.map(adapter =>  {
            return adapter.accepts() + (adapter.supports(contentType) ? ';q=1' : ';q=0.8');
        }).join(',');
    }

    private build(url, response: Response) {
        let contentType = response.getHeader('content-type');
        let adapter = this.getAdapter(contentType);

        return adapter.build(this, url, this.accept(contentType), response);
    }
}
