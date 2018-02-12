
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

    build(agent, url: string, accept: string, contentType, body)
    {
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        return new Resource(
            url,
            contentType,
            this.normalizeLinks(agent, url, accept, body, contentType),
        );
    }

    private normalizeLinks(agent, url, accept, content, contentType) {
        if (!content._links) {
            return  [];
        }

        return Object.keys(content._links || {})
            .filter(rel => !content._links[rel].templated)
            .map(rel => {
                let links = this.normalizeLink(content, rel);
                let resolved = new Map();

                let embedded = ((content._embedded || {})[rel] || []);
                if (!Array.isArray(embedded)) {
                    embedded = [embedded];
                }

                embedded.forEach(item => {
                    let itemLinks = this.normalizeLink(item, 'self');
                    if (itemLinks[0]) {
                        resolved.set(itemLinks[0].href, agent.build(itemLinks[0].href, links[0].type || contentType, item))
                    }
                });

                return new Link(rel, agent, accept, links.map(link => link.href), resolved);
            });
        ;
    }

    private normalizeLink(content, rel)
    {
        let links = (content._links || {})[rel] || [];
        if (typeof links === 'string') {
            links = [{href: links}];
        }

        if (!Array.isArray(links)) {
            links = [links];
        }

        return links;
    }
}

