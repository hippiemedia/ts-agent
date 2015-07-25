
import _ from 'lodash';

export function client(method, url, params, headers) {
    return new Promise((resolve, reject) => {
        var r = new XMLHttpRequest();
        r.open(method, url, true);
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
            r.setRequestHeader(header, headers[header]);
        });
        r.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                resolve({url: url, xhr: this});
            } else {
                reject(this);
            }
        };
        r.onerror = function () {
          reject(this);
        };
        r.send(params);
    });
};
