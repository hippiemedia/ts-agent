
import * as _ from 'lodash';
import Response from './client/response';

export default function client(method, url, params, headers) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        //xhr.open(method, 'https://cors-anywhere.herokuapp.com/'+url, true);
        params = Object.keys(params || {}).map(function(key){
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');

        headers = _.merge({}, {
            'X-Requested-With': 'hippiemedia'
        }, headers || {});

        if (-1 !== ['post', 'put', 'patch'].indexOf(method.toLowerCase())) {
            headers = _.merge({}, {
                'Content-type': 'application/x-www-form-urlencoded',
                'Content-length': params.length,
                'Connection': 'close'
            }, headers);
        }
        Object.keys(headers || {}).forEach(header => {
            xhr.setRequestHeader(header, headers[header]);
        });
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                resolve({url: url, xhr: xhr, requestHeaders: headers});
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
