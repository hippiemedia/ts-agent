
import Adapter from '../adapter';
export default class CollectionJson implements Adapter
{
    supports(contentType) {
        return contentType.includes('application/vnd.collection+json');
    }

    accepts() {
        return 'application/vnd.collection+json';
    }

    build(builder, text) {
        this.fromObject(builder, JSON.parse(text).collection);
    }

    fromObject(builder, content) {
        content.links.push({rel: 'self', url: content.href});
        if (content.template) {
            content.template.rel = 'self';
        }
        builder
            .data(content.data)
            .links(content.links)
            .items(content.items)
            .operations(content.template)
            .queries(content.queries)
        ;
    }
}
