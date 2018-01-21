
import Adapter from '../adapter';
import Resource from '../resource';
import Link from '../resource/link';
import Query from '../resource/query';
import Response from '../client/response';
import {resolve} from 'url';

export default class HalJson implements Adapter
{
    supports(contentType)
    {
        return contentType.includes('application/hal+json');
    }

    accepts()
    {
        return 'application/hal+json';
    }

    build(agent, url: string, accept: string, response: Response)
    {
        return this.fromObject(agent, url, accept, response, JSON.parse(response.body));
    }

    private async fromObject(agent, url, accept, response, content)
    {
        return new Resource(
            url,
            response.contentType,
            this.normalizeLinks(content, link => !link.templated).map(link => {
                return new Link(agent, link.rel, resolve(url, link.href), accept);
            }),
            [], // items
            [], // operations
            this.normalizeLinks(content, link => link.templated).map(link => {
                return new Query(agent, link.rel, resolve(url, link.href), accept);
            })
        );
    }

    private normalizeLinks(content, filter) {
        if (!content._links) {
            return  [];
        }

        return Object.keys(content._links).reduce((acc, rel) => {
            let links = content._links[rel];
            if (typeof links === 'string') {
                links = [{href: links}];
            }
            if (!Array.isArray(links)) {
                links = [links];
            }

            return acc.concat(links.filter(filter).map(link => {
                link.rel = rel;
                return link;
            }));
        }, []);
    }
}

