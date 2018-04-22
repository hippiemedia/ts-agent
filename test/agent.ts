
import Agent from '../src/agent';

test('can be instantiated', () => {
    new Agent([], (method, url, params, headers) => {
        return Promise.resolve({
            getHeader: function() {},
            contentType: 'application/hal+json',
            body: ''
        });
    });
});
