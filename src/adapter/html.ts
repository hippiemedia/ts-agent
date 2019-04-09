
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

    build(agent, response: Response, accept: string): Resource
    {
        let parser = new DOMParser();
        let doc = parser.parseFromString(response.body, 'text/html');

        return new Resource(
            response,
            doc,
            Array.from(doc.documentElement.querySelectorAll('a, *[rel]')).map((link: HTMLLinkElement) => {
                return new Link(
                    link.getAttribute('rel') || 'link',
                    link.getAttribute('title') || link.href,
                    '',
                    agent,
                    accept,
                    link.href,
                    null,
                    false,
                    false
                );
            }).concat(Array.from(doc.documentElement.querySelectorAll('form[method="get"]')).map((form: HTMLFormElement) => {
                return new Link(
                    form.getAttribute('rel') || 'link',
                    form.getAttribute('title') || decodeURIComponent(form.action),
                    '',
                    agent,
                    accept,
                    decodeURIComponent(form.action),
                    null,
                    true,
                    false
                );
            })),
            Array.from(doc.documentElement.querySelectorAll('form[method="post"]')).map((form: HTMLFormElement) => {
                return new Operation(
                    agent,
                    form.getAttribute('method'),
                    form.action,
                    '',
                    form.getAttribute('method'),
                    decodeURIComponent(form.action),
                    false,
                    accept,
                    []
                );
            })
        );
    }
}

