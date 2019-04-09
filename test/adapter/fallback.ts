
import Fallback from '../../src/adapter/fallback';
import Agent from '../../src/agent';
import * as fs from 'fs'


const adapter = new Fallback();
const agent = new Agent([adapter], (method, url, params, headers) => {
    return Promise.resolve({
        url: url,
        status: 200,
        getHeader: (name) => ({'content-type': 'text/plain'}[name]) || null,
        contentType: 'text/plain',
        body: '{}'
    });
});

test('populates body', async () => {
    let body = fs.readFileSync('test/format/hal/example.json').toString();
    let resource = await adapter.build(agent, {
        url: 'http://example.com',
        status: 200,
        contentType: 'text/plain',
        getHeader: (name) => ({'content-type': 'text/plain'}[name]) || null,
        body: body,
    }, 'text/plain');

    expect(resource.state).toEqual(body);
});
