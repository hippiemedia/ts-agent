
import Adapter from '../adapter';
export default class HalJson implements Adapter
{
    supports(contentType) {
        return contentType.includes('application/hal+json') || contentType.includes('application/json');
    }

    accepts() {
        return 'application/hal+json';
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
