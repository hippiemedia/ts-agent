
import Agent from './agent';
import JsonLd from './adapter/json-ld';
import HalJson from './adapter/hal-json';
import client from './client';
import Resource from './resource';

export default function factory(decorator = null) {
    return new Agent(
        [
            //new JsonLd(),
            new HalJson(),
        ],
        decorator ? decorator(client) : client
    );
};

