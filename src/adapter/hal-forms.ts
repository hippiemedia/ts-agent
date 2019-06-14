
import Adapter from '../adapter';
import Resource from '../resource';
import Operation from '../resource/operation';
import Response from '../client/response';
import HalJson from './hal-json';

export default class HalForms implements Adapter
{
    private hal;

    constructor(hal: HalJson) {
        this.hal = hal;
    }

    supports(contentType)
    {
        return contentType.includes('application/prs.hal-forms+json');
    }

    accepts(contentType)
    {
        return 'application/prs.hal-forms+json;' + (this.supports(contentType) ? 'q=1' : 'q=0.8');
    }

    build(agent, response: Response, accept: string): Resource
    {
        let body = response.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        let templates = body._templates;
        if (!Array.isArray(templates)) {
            templates = [templates];
        }

        let operations = templates.map(template => {
            return new Operation(
                agent,
                'default',
                template.default.title,
                template.default.description,
                template.default.method,
                response.url,
                template.default.templated || false,
                accept,
                template.default.properties
            );
        });

        let state = {...body};
        delete state._links;
        delete state._templates;

        let links = this.hal.buildLinks(agent, response, body, accept);

        return new Resource(
            response,
            state,
            links,
            operations
        );
    }
}

