
import Resource from './resource';
import Adapter from './adapter';
import Response from './client/response';
import {Client} from './client';

export default class Agent
{
    private adapters: Adapter[];
    private client: Client;

    constructor(adapters: Adapter[], client: Client) {
        this.adapters = adapters;
        this.client = client;
    }

    follow(url: string): Promise<Resource> {
        return this.call('get', url, {}, {Accept: this.accept('')});
    }

    async call(method, url, params, headers = {}): Promise<Resource> {
        let response = await this.client(method, url, params, headers);
        let resource = this.build(response);

        return resource;
    }

    build(response: Response) {
        let contentType = response.contentType || '';
        let adapter = this.getAdapter(contentType);

        return adapter.build(this, response, this.accept(contentType));
    }

    private getAdapter(contentType: string): Adapter {
        return this.adapters.find(adapter => {
            return adapter.supports(contentType);
        }) || (() => { throw Error(contentType); })();
    }

    accept(contentType: string): string {
        return this.adapters.map(adapter =>  {
            return adapter.accepts(contentType);
        }).join(',');
    }
}
