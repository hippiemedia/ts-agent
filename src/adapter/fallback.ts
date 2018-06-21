
import Adapter from '../adapter';
import Resource from '../resource';
import Link from '../resource/link';
import Response from '../client/response';
import {resolve} from 'url';

export default class Json implements Adapter
{
    supports(contentType)
    {
        return true;
    }

    accepts()
    {
        return '*/*';
    }

    build(agent, response: Response, accept: string)
    {
        return new Resource(
            response,
            response.body
        );
    }
}

