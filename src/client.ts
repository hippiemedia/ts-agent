
import Response from './client/response';

export interface Client { (method, url, body: string, headers): Promise<Response> };

export async function fetchApi(method, url, body, headers): Promise<Response> {
    return fetch(url, {
        method: method,
        headers: {'Content-Type': 'application/x-www-form-urlencoded', ...headers},
        body: (-1 !== ['post', 'put', 'patch'].indexOf(method.toLowerCase())) ? body : null
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
}

export function xhr(method, url, body, headers): Promise<Response> {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        if (-1 !== ['post', 'put', 'patch'].indexOf(method.toLowerCase())) {
            headers = Object.assign({}, {
                'Content-type': 'application/x-www-form-urlencoded',
                //'Content-length': params.length,
                //'Connection': 'close'
            }, headers);
        }
        Object.keys(headers || {}).forEach(header => {
            xhr.setRequestHeader(header, headers[header]);
        });
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                resolve({
                    url: url,
                    status: xhr.status,
                    contentType: xhr.getResponseHeader('content-type'),
                    getHeader: xhr.getResponseHeader.bind(xhr),
                    body: xhr.responseText,
                });
            } else {
                reject(xhr);
            }
        };
        xhr.onerror = () => {
          reject(this);
        };
        xhr.send(body);
    });
};
