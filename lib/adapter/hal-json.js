
import {UriTemplate} from 'uri-templates';

export class HalJson
{
    constructor(router) {
        this.router = router;
    }

    supports(contentType) {
        return contentType.indexOf('application/hal+json') === 0
            || contentType.indexOf('application/json') === 0
        ;
    }

    accepts() {
        return 'application/hal+json, application/json, */*; q=0.01';
    }

    build(builder, text) {
        this.fromObject(builder, JSON.parse(text));
    }

    fromObject(builder, content) {
        [].concat.apply([], Object.keys(content._embedded || []).forEach(key => {
            builder.items(content._embedded[key]);
        }));
        var links = content._links || {};
        var curies = links.curies || [];
        delete links.curies;
        Object.keys(links).map(rel => {
            [].concat(content._links[rel]).map(link => {
              builder.links({
                rel: rel,
                url: link.href
              });
            });
        });

        curies.map(curie => {
            curie.rel = curie.name;
            builder.queries({
              rel: curie.name,
              url: curie.href
            });
        });

        builder
            .data(content)
        ;
    }
}
