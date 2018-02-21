
import Adapter from '../adapter';

export default class Html implements Adapter
{
    accepts() {
        return 'text/html';
    }

    supports(contentType) {
        return contentType.includes('text/html');
    }

    build(builder, text) {
        var doc = document.implementation.createHTMLDocument('title');
        doc.documentElement.innerHTML = text;
        this.fromObject(builder, {
            links: Array.prototype.map.call(doc.documentElement.querySelectorAll('a, *[rel]'), link => {
                return {
                    rel: link.getAttribute('rel'),
                    url: link.getAttribute('href'),
                };
            }),
            data: text,
            forms: Array.prototype.map.call(doc.documentElement.querySelectorAll('form[method="post"]'), form => {
                return {
                    rel: form.getAttribute('name'),
                    url: form.getAttribute('action'),
                    data: form.querySelectorAll('input'),
                };
            }),
            queries: Array.prototype.map.call(doc.documentElement.querySelectorAll('form[method="get"]'), form => {
                return {
                    rel: form.getAttribute('name'),
                    url: form.getAttribute('action'),
                    data: form.querySelectorAll('input'),
                };
            }),
        });
    }

    fromObject(builder, content) {
        builder
            .links({rel: 'self', url: content.href})
            .links(content.links)
            .data(content.data)
            .operations(content.forms)
            .queries(content.queries)
        ;
    }
}
