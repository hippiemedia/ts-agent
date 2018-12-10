
import Adapter from '../adapter';
import Resource from '../resource';
import Link from '../resource/link';
import Response from '../client/response';

export default class SirenJson implements Adapter
{
    supports(contentType)
    {
        return contentType.includes('application/vnd.siren+json');
    }

    accepts()
    {
        return 'application/vnd.siren+json';
    }

    build(agent, response: Response, accept: string)
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
