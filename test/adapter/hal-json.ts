
import HalJson from '../../src/adapter/hal-json';
import Resource from '../../src/resource';
import Agent from '../../src/agent';

const fs = require('fs');

const adapter = new HalJson();
const agent = new Agent([adapter], function() {});
const response = {
    getHeader: function() {},
    contentType: 'application/hal+json',
    body: ''
};

test('populates resource', async function() {
    response.body = fs.readFileSync('test/format/hal.json');

    let resource = await adapter.build(agent, 'http://example.com', 'application/hal+json', response);

    expect(resource.links).toHaveLength(4);
    expect(resource.link('self').url).toEqual('http://example.com/orders');
});

test('uses embedded', async function() {
    response.body = fs.readFileSync('test/format/hal.json');

    let resource = await adapter.build(agent, 'http://example.com', 'application/hal+json', response);

    expect(resource.links).toHaveLength(4);
    expect(resource.link('self').url).toEqual('http://example.com/orders');
});
