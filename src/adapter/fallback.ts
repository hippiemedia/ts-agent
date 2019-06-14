
import Adapter from '../adapter';
import Resource from '../resource';
import Link from '../resource/link';
import Response from '../client/response';

export default class Fallback implements Adapter
{
    supports(contentType)
    {
        return true;
    }

    accepts(contentType)
    {
        return '*/*;q=0.8';
    }

    build(agent, response: Response, accept: string): Resource
    {
        return new Resource(
            response,
            response.body
        );
    }
}

