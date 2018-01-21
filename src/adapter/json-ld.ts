
import Adapter from '../adapter';
import Resource from '../resource';
import Response from '../client/response';
import * as linkFormat from 'h5.linkformat';

export default class JsonLd implements Adapter
{
    supports(contentType)
    {
        return contentType.includes('application/ld+json');
    }

    accepts()
    {
        return 'application/ld+json';
    }

    build(agent, url: string, accept: string, response: Response)
    {
        return this.fromObject(agent, url, accept, response, JSON.parse(response.body));
    }

    private async fromObject(agent, url, accept, response, content)
    {
        let link = response.getHeader('link');
        let docs = await Promise.all(linkFormat.parse(link).filter(link => {
            return link.rel === 'http://www.w3.org/ns/hydra/core#apiDocumentation' && url !== link.href;
        }).map(link => {
            return agent.follow(link.href);
        }));

        return new Resource(
            url,
            response.contentType
        );
    }
}

