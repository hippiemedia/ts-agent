
import Adapter from '../adapter';
import Resource from '../resource';
import Link from '../resource/link';
import Operation from '../resource/operation';
import Response from '../client/response';

export default class Html implements Adapter
{
    supports(contentType)
    {
        return contentType.includes('text/html');
    }

    accepts()
    {
        return 'text/html';
    }

    build(agent, response: Response, accept: string)
    {
        let parser = new DOMParser();
        let doc = parser.parseFromString(response.body, 'text/html');

        return new Resource(
            response,
            doc,
            Array.from(doc.documentElement.querySelectorAll('a, *[rel]')).map(link => {
                return new Link(
                    link.getAttribute('rel') || 'link',
                    link.getAttribute('title') || link.getAttribute('href'),
                    '',
                    agent,
                    accept,
                    link.getAttribute('href'),
                    null,
                    false
                );
            }).concat(Array.from(doc.documentElement.querySelectorAll('form[method="get"]')).map(link => {
                return new Link(
                    link.getAttribute('rel') || 'link',
                    link.getAttribute('title') || link.getAttribute('action'),
                    '',
                    agent,
                    accept,
                    link.getAttribute('action'),
                    null,
                    true
                );
            })),
            Array.from(doc.documentElement.querySelectorAll('form[method="post"]')).map(form => {
                return new Operation(
                    agent,
                    form.getAttribute('method'),
                    form.getAttribute('action'),
                    '',
                    form.getAttribute('method'),
                    form.getAttribute('action'),
                    false,
                    accept,
                    []
                );
            })
        );
    }
}

