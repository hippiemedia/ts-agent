
import Adapter from '../adapter';
import Resource from '../resource';
import Link from '../resource/link';
import Response from '../client/response';

export default class Json implements Adapter
{
    supports(contentType)
    {
        return contentType.includes('application/json');
    }

    accepts()
    {
        return 'application/json';
    }

    build(agent, response: Response, accept: string): Resource
    {
        let body = response.body;
        if (typeof response.body === 'string') {
            body = JSON.parse(response.body);
        }

        return new Resource(
            response,
            body
        );
    }
}

