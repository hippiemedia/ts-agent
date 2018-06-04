
import Adapter from '../adapter';
import Resource from '../resource';
import Link from '../resource/link';
import Response from '../client/response';
import {resolve} from 'url';

export default class HalJson implements Adapter
{
    supports(contentType)
    {
        return contentType.includes('application/hal+json')
            || contentType.includes('application/vnd.error+json');
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

        let state = {...body};
        delete state._links;
        delete state._embedded;

        return new Resource(
            url,
            state,
            contentType,
            this.buildLinks(agent, url, accept, body, contentType)
        );
    }

    private buildLinks(agent, url, accept, content, contentType) {
        if (!content._links) {
            return [];
        }

        return Object.keys(content._links || {}).map(rel => {
            let links = this.normalizeLinks(content, rel);
            let resolved = new Map();

            let embedded = ((content._embedded || {})[rel] || []);
            if (!Array.isArray(embedded)) {
                embedded = [embedded];
            }

            embedded.forEach(entry => {
                let entryLinks = this.normalizeLinks(entry, 'self');
                if (entryLinks[0]) {
                    resolved.set(entryLinks[0].href, agent.build(entryLinks[0].href, links[0].type || contentType, entry))
                }
            });

            return links.map(link => new Link(rel, agent, accept, link.href, resolved.get(link.href), link.templated || false));
        }).reduce((acc, val) => acc.concat(val), []);
    }

    private normalizeLinks(content, rel)
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

