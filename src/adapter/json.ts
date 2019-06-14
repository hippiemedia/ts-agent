
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

    accepts(contentType)
    {
        return 'application/json;' + (this.supports(contentType) ? 'q=1' : 'q=0.8');
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

