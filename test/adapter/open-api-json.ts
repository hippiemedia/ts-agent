import OpenApiJson from "../../src/adapter/open-api-json";
import Agent from "../../src/agent";
import * as fs from "fs";

const response = {
    url: 'http://example.com',
    status: 200,
    contentType: 'application/oas3+json',
    getHeader: (name) => ({'content-type': 'application/oas3+json'}[name.toLowerCase()]) || null,
    body: fs.readFileSync('test/format/open-api/example2.json').toString(),
};
const adapter = new OpenApiJson();
const agent = new Agent([adapter], (method, url, params, headers) => {
    return Promise.resolve(response);
});
/*
test('it populates state', async () => {
    let resource = adapter.build(agent, response, 'application/oas3+json');

    expect(resource.state).toEqual(0);
});
*/
test('it populates links', async () => {
    let resource = adapter.build(agent, response, 'application/oas3+json');

    expect(resource.links.length).toBeGreaterThan(0);
});

test('it populates operations', async () => {
    let resource = adapter.build(agent, response, 'application/oas3+json');

    expect(resource.operations.length).toBeGreaterThan(0);
});