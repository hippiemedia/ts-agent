
import Agent from './agent';
import JsonLd from './adapter/json-ld';
import HalJson from './adapter/hal-json';
import HalForms from './adapter/hal-forms';
import {xhr} from './client';

export default function factory() {
    return new Agent(
        [
            //new JsonLd(),
            new HalJson(),
            new HalForms(),
        ],
        xhr
    );
};

