
import Adapter from '../adapter';
export default class AlpsXml implements Adapter
{
    supports(contentType) {
        return contentType.includes('application/alps+xml');
    }

    accepts() {
        return 'application/alps+xml';
    }

    build(builder, text) {
        this.fromObject(builder, text);
    }

    fromObject(builder, content) {
    }
}

