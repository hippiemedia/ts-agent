
import Agent from './agent';
import HalJson from './adapter/hal-json';
import CollectionJson from './adapter/collection-json';
import AlpsJson from './adapter/alps-json';
import AlpsXml from './adapter/alps-xml';
import JsonLd from './adapter/json-ld';
import Html from './adapter/html';
import Fallback from './adapter/fallback';
import client from './client';
import Resource from './resource';

export default function factory(decorator = null) {
    return new Agent(
        [
            new JsonLd(),
            new HalJson(),
            new CollectionJson(),
            new Html(),
            new AlpsJson(),
            //new AlpsXml(new AlpsJson()),
            new Fallback(),
        ],
        decorator ? decorator(client) : client
    );
};

