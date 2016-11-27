
import Adapter from '../adapter';

export default class AlpsJson implements Adapter
{
    supports(contentType) {
        return contentType.includes('application/alps+json');
    }

    accepts() {
        return 'application/alps+json';
    }

    build(builder, text) {
        this.fromObject(builder, JSON.parse(text).alps);
    }

    fromObject(builder, content) {
        builder
            .data(content)
            .profiles(content.descriptor)
        ;
    }
}

