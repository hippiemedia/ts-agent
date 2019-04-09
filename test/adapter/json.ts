
import Json from '../../src/adapter/json';
import Agent from '../../src/agent';
import * as fs from 'fs'


const adapter = new Json();
const agent = new Agent([adapter], (method, url, params, headers) => {
    return Promise.resolve({
        url: url,
        status: 200,
        getHeader: (name) => ({'content-type': 'application/json'}[name]) || null,
        contentType: 'application/json',
        body: '{}'
    });
});

test('populates body', async () => {
    let body = fs.readFileSync('test/format/hal/example.json').toString();
    let resource = await adapter.build(agent, {
        url: 'http://example.com',
        status: 200,
        contentType: 'application/json',
        getHeader: (name) => ({'content-type': 'application/json'}[name]) || null,
        body: body,
    }, 'application/json');

    expect(resource.state).toEqual(JSON.parse(body));
});
