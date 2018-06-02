
import Agent from './agent';
import JsonLd from './adapter/json-ld';
import HalJson from './adapter/hal-json';
import HalForms from './adapter/hal-forms';
import {xhr} from './client';

export default function factory(decorator: Function = null) {
    return new Agent(
        [
            //new JsonLd(),
            new HalJson(),
            new HalForms(),
        ],
        decorator ? decorator(xhr) : xhr
    );
};

