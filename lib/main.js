
import {Agent} from './agent';
import {HalJson} from './adapter/hal-json';
import {CollectionJson} from './adapter/collection-json';
import {AlpsJson} from './adapter/alps-json';
import {AlpsXml} from './adapter/alps-xml';
import {JsonLd} from './adapter/json-ld';
import {Html} from './adapter/html';
import {Fallback} from './adapter/fallback';
import {client} from './client';
import {Resource} from './resource';

export function factory(decorator) {
    return new Agent(
        [
            new CollectionJson(),
            new HalJson(),
            new JsonLd(),
            new AlpsJson(),
            new AlpsXml(new AlpsJson()),
            new Html(),
            new Fallback(),
        ],
        decorator ? decorator(client) : client
    );
};

