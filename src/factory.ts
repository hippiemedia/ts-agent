
import Agent from './agent';
import HalJson from './adapter/hal-json';
import HalForms from './adapter/hal-forms';
import {fetchApi as client} from './client';

export default function factory(decorator: Function = null) {
    return new Agent(
        [
            new HalJson(),
            new HalForms(),
        ],
        decorator ? decorator(client) : client
    );
};

