
import Adapter from '../adapter';
import Resource from '../resource';
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

    build(agent, url: string, accept: string, contentType, body)
    {
        return this.fromObject(agent, url, accept, contentType, JSON.parse(body));
    }

    private async fromObject(agent, url, accept, contentType, content)
    {
        //let link = response.getHeader('link');
        //let docs = await Promise.all(linkFormat.parse(link).filter(link => {
        //    return link.rel === 'http://www.w3.org/ns/hydra/core#apiDocumentation' && url !== link.href;
        //}).map(link => {
        //    return agent.follow(link.href);
        //}));

        return new Resource(
            url,
            contentType
        );
    }
}

