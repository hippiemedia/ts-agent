
import Response from './client/response';

export interface Client { (method, url, body: string, headers): Promise<Response> };

export interface ClientFactory {
    (bodySerializers: any): Client
};

export const defaultBodySerializers = {
    'application/x-www-form-urlencoded': function(body: any): string {
        return new URLSearchParams(body).toString();
    },
    'application/json': function(body: any): string {
        return JSON.stringify(body);
    },
};


export let fetchApi: ClientFactory = function(bodySerializers): Client {
    return async (method, url, body, headersHash): Promise<Response> => {
        let headers = new Headers(headersHash);
        if (!headers.has('Content-Type')) {
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
        }

        let bodySerializer = bodySerializers[headers.get('Content-Type')];

        return fetch(url, {
            method: method,
            headers: headers,
            body: (-1 !== ['post', 'put', 'patch'].indexOf(method.toLowerCase())) ? bodySerializer(body) : null
        }).then(async function(response) {
            return {
                url: url,
                status: response.status,
                contentType: response.headers.get('content-type'),
                getHeader: (name) => {
                    return response.headers.get(name);
                },
                body: await response.text(),
            };
        });
    };
}
