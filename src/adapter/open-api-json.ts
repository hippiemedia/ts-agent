
import Adapter from '../adapter';
import Resource from '../resource';
import Link from '../resource/link';
import Operation, {Field} from '../resource/operation';
import Response from '../client/response';
import Agent from "../agent";

export default class OpenApiJson implements Adapter
{
    static readonly CONTENT_TYPE = 'application/oas3+json';

    supports(contentType)
    {
        return contentType.includes(OpenApiJson.CONTENT_TYPE);
    }

    accepts(contentType)
    {
        return `${OpenApiJson.CONTENT_TYPE};${(this.supports(contentType) ? 'q=1' : 'q=0.8')}`;
    }

    build(agent, response: Response, accept: string): Resource
    {
        let body = response.body;
        if (typeof response.body === 'string') {
            body = JSON.parse(response.body);
        }

        let state = {...body};

        let links = Object.entries(body.paths)
            .filter((entry) => {
                let data = entry[1];
                return Object.keys(data).includes("get");
            })
            .map((entry) => {
                let path = entry[0];
                let data = entry[1];

                return this.buildLink(path, data, agent);
            });

        let operations = Object.entries(body.paths)
            .filter((entry) => {
                let data = entry[1];
                let dataKeys = Object.keys(data);

                return (
                    dataKeys.includes('post') ||
                    dataKeys.includes('delete') ||
                    dataKeys.includes('put') ||
                    dataKeys.includes('patch')
                );
            })
            .map((entry) => {
                let path = entry[0];
                let data = entry[1];

                return this.buildOperation(path, data, agent);
            });

        return new Resource(response, state, links, operations);
    }

    private buildLink(path, data, agent: Agent): Link
    {
        let operation = data.get;
        let title = operation.summary || '';
        let description = operation.description || '';
        let rel = operation.operationId || '';

        return new Link(
            rel,
            title,
            description,
            agent,
            OpenApiJson.CONTENT_TYPE,
            path,
            false,
            false,
            false
        );
    }

    private buildOperation(path, data, agent: Agent): Operation
    {
        let method = Object.keys(data).find((property) => {
            return ['post', 'delete', 'put', 'patch'].includes(property)
        });
        let operation = data[method];
        let title = operation.summary || '';
        let description = operation.description || '';
        let rel = operation.operationId || '';
        let fields = this.buildFields(method, data[method]);

        return new Operation(
            agent,
            rel,
            title,
            description,
            method,
            path,
            false,
            OpenApiJson.CONTENT_TYPE,
            fields
        );
    }

    private buildFields(method, operation): Array<Field>
    {
        if ('post' === method &&  operation.requestBody) {
            let operationProperties = operation.requestBody.content['application/x-www-form-urlencoded'].schema.properties || {};

            return Object.entries(operationProperties).map((entry) => {
               let propertyName = entry[0];
               let property = entry[1];

               return {
                   name: propertyName,
                   description: property.description || '',
                   type: property.type || 'string',
                   required: property.required || false,
                   value: property.value || '',
                   multiple: property.multiple || '',
                   example: property.example || '',
               };
           });
        }

        return [];
    }
}
