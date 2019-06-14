
import Agent from '../src/agent';
import Fallback from '../src/adapter/fallback';
import HallJson from '../src/adapter/hal-json';
import Json from '../src/adapter/json';

function createAgent(adapters=[]) {
    return new Agent(adapters, (method, url, params, headers) => {
        return Promise.resolve({
            url: '',
            status: 200,
            getHeader: function() {},
            contentType: 'application/hal+json',
            body: ''
        });
    });

}

test('it accepts format with no adapter', () => {
    const agent = createAgent();
    expect(agent.accept('application/json')).toEqual('');
});

test('it accepts format with Fallback adapter', () => {
    const agent = createAgent([new Fallback()]);
    expect(agent.accept('application/json')).toEqual('*/*;q=0.8');
});

test('it accepts format with supported adapter', () => {
    const agent = createAgent([new HallJson()]);
    expect(agent.accept('application/hal+json')).toEqual('application/hal+json;q=1');
});

test('it accepts format with many supported adapter', () => {
    const agent = createAgent([new HallJson(), new Json(), new Fallback()]);
    expect(agent.accept('application/hal+json')).toEqual('application/hal+json;q=1,application/json;q=0.8,*/*;q=0.8');
});

test('it accepts format with not supported content type', () => {
    const agent = createAgent([new HallJson(), new Json(), new Fallback()]);
    expect(agent.accept('application/oas3+json')).toEqual('application/hal+json;q=0.8,application/json;q=0.8,*/*;q=0.8');
});