
import _ from 'lodash';

export function client(method, url, params, headers) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
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
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                resolve({url: url, xhr: this, requestHeaders: headers});
            } else {
                reject(this);
            }
        };
        xhr.onerror = function () {
          reject(this);
        };
        xhr.send(params);
    });
};
