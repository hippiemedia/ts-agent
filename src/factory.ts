
import Agent from './agent';
import JsonLd from './adapter/json-ld';
import HalJson from './adapter/hal-json';
import {xhr} from './client';
import Resource from './resource';

export default function factory() {
    return new Agent(
        [
            //new JsonLd(),
            new HalJson(),
        ],
        xhr
    );
};
