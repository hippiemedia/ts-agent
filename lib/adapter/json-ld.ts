
import Adapter from '../adapter';

export default class JsonLd implements Adapter
{
    supports(contentType) {
        return contentType.includes('application/ld+json');
    }

    accepts() {
        return 'application/ld+json';
    }

    build(builder, text) {
        this.fromObject(builder, JSON.parse(text));
    }

    fromObject(builder, content) {
        builder
            .profiles(content['@context'])
            .data(content)
        ;
    }
}

