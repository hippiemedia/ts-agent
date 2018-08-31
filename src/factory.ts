
import Agent from './agent';
import HalJson from './adapter/hal-json';
import HalForms from './adapter/hal-forms';
import Json from './adapter/json';
import Html from './adapter/html';
import Fallback from './adapter/fallback';
import {fetchApi as client} from './client';

export default function factory(decorator: Function = null) {
    let halJson = new HalJson();
    return new Agent(
        [
            halJson,
            new HalForms(halJson),
            new Json(),
            new Html(),
            new Fallback()
        ],
        decorator ? decorator(client) : client
    );
};

window['agent'] = factory();
