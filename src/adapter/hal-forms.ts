
import Adapter from '../adapter';
import Resource from '../resource';
import Operation from '../resource/operation';
import Response from '../client/response';

export default class HalForms implements Adapter
{
    supports(contentType)
    {
        return contentType.includes('application/prs.hal-forms+json');
    }

    accepts()
    {
        return 'application/prs.hal-forms+json';
    }

    build(agent, response: Response, accept: string)
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

        return new Resource(response, state, [], [], operations);
    }
}

