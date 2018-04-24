
import HalJson from '../../src/adapter/hal-json';
import HalForms from '../../src/adapter/hal-forms';
import Agent from '../../src/agent';

const fs = require('fs');

const adapter = new HalJson();
const agent = new Agent([adapter, new HalForms], (method, url, params, headers) => {
    return Promise.resolve({
        getHeader: () => 'application/hal+json',
        contentType: 'application/hal+json',
        body: '{}'
    });
});

test('populates links', async () => {
    let resource = await adapter.build(agent, 'http://example.com', 'application/hal+json', 'application/hal+json', fs.readFileSync('test/format/hal/example.json').toString());

    expect(resource.allLinks).toHaveLength(6);

    let found = await resource.follow('ea:find', {id: 'test'});
    expect(found.url).toBe('/orders?id=test');
});

test('uses embedded', async () => {
    let resource = await adapter.build(agent, 'http://example.com', 'application/hal+json', 'application/hal+json', fs.readFileSync('test/format/hal/collection.json').toString());

    expect(resource.followAll('item')).toHaveLength(30);
});

test('populates operations', async () => {
    let resource = await adapter.build(agent, 'http://example.com', 'application/hal+json', 'application/hal+json', fs.readFileSync('test/format/hal/collection.json').toString());

    let op = await resource.follow('activate').then(r => r.operation('default'));
    expect(op.fields).toHaveLength(2);
    expect(op.fields[0]).toEqual({name: 'when', required : true, type: 'datetime'});
    expect(op.fields[1]).toEqual({name: 'reason', required : false, type: 'string'});
});
