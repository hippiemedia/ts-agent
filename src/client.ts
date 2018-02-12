
import * as _ from 'lodash';
import Response from './client/response';

export interface Client { (method, url, params, headers): Promise<Response> };

export async function fetchApi(method, url, params, headers): Promise<Response> {
    return fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(params),
    }).then(async function(response) {
        return {
            contentType: await response.headers.get('content-type'),
            getHeader: response.headers.get.bind(response),
            body: await response.text(),
        };
    });
}

export function xhr(method, url, params, headers): Promise<Response> {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        params = Object.keys(params || {}).map(function(key){
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');

        if (-1 !== ['post', 'put', 'patch'].indexOf(method.toLowerCase())) {
            headers = _.merge({}, {
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
        xhr.send(params);
    });
};
