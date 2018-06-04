
import Adapter from '../adapter';
import Resource from '../resource';
import Operation from '../resource/operation';

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

    build(agent, url: string, accept: string, contentType, body)
    {
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        let templates = body._templates;
        if (!Array.isArray(templates)) {
            templates = [templates];
        }

        let operations = templates.map(template => {
            return new Operation(agent, 'default', template.default.method, url, accept, template.default.properties); //@TODO .default ?
        });

        let state = {...body};
        delete state._links;
        delete state._templates;

        return new Resource(url, state, contentType, [], operations);
    }
}

