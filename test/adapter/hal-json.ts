
import HalJson from '../../lib/adapter/hal-json';
import Builder from '../../lib/resource/builder';
import Agent from '../../lib/agent';

const fs = require('fs');

test('populates resource', function() {
    let adapter = new HalJson();
    let builder = new Builder(new Agent([], () => {}), 'http://example.com/resource');

    adapter.build(builder, fs.readFileSync('test/format/hal.json'));

    let resource = builder.build();

    resource.link('self');
});
