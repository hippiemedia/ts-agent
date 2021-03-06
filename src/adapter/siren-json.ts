
import Adapter from '../adapter';
import Resource from '../resource';
import Link from '../resource/link';
import Operation from '../resource/operation';
import Response from '../client/response';
import * as LinkHeader from 'http-link-header';

export default class SirenJson implements Adapter
{
    supports(contentType)
    {
        return contentType.includes('application/vnd.siren+json');
    }

    accepts(contentType)
    {
        return 'application/vnd.siren+json;' + (this.supports(contentType) ? 'q=1' : 'q=0.8');
    }

    build(agent, response: Response, accept: string): Resource
    {
        let body = response.body;
        if (typeof response.body === 'string') {
            body = JSON.parse(response.body);
        }

        return new Resource(
            response,
            body.properties,
            body.links.map(link => new Link(
                link.rel[0],
                link.title || '',
                link.description || '',
                agent,
                accept,
                link.href,
                null,
                link.templated || false,
                false
            )).concat(LinkHeader.parse(response.getHeader('link') || '').refs.map(link => new Link(
                link.rel,
                link.title || '',
                link.description || '',
                agent,
                link.type || accept,
                link.uri,
                null,
                link.templated || false,
                false
            ))),
            body.actions.map(operation => new Operation(
                agent,
                operation.rel,
                operation.title || '',
                operation.description || '',
                operation.method,
                operation.href,
                operation.templated || false,
                accept,
                operation.fields
            ))
        );
    }
}
