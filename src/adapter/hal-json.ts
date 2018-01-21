
import Adapter from '../adapter';
import Resource from '../resource';
import {Resolved, Unresolved, Link} from '../resource/link';
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
        return this.fromObject(agent, url, accept, response.contentType, JSON.parse(response.body));
    }

    private fromObject(agent, url, accept, contentType, content)
    {
        return new Resource(
            url,
            contentType,
            this.normalizeLinks(agent, url, accept, content, contentType),
        );
    }

    private normalizeLinks(agent, url, accept, content, contentType) {
        if (!content._links) {
            return  [];
        }

        return Object.keys(content._links)
            .filter(rel => !content._links[rel].templated)
            .map(rel => {
                let links = content._links[rel];
                if (typeof links === 'string') {
                    links = [{href: links}];
                }

                if (!Array.isArray(links)) {
                    links = [links];
                }

                if (content._embedded && content._embedded[rel]) {
                    return new Resolved(
                        rel,
                        links.map((link, index) =>
                            this.fromObject(
                                agent,
                                resolve(url, link.href),
                                accept,
                                contentType,
                                content._embedded[rel][index]
                            )
                        )
                    );
                }
                return new Unresolved(
                    agent,
                    rel,
                    links.map(link => resolve(url, link.href)),
                    accept
                );
            })
        ;
    }
}

