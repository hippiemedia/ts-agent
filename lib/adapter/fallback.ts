
import Adapter from '../adapter';
export default class Fallback implements Adapter
{
    supports(contentType) {
        return true;
    }

    accepts() {
        return '*/*';
    }

    build(builder, text) {
        builder.data(text);
    }

    fromObject(builder, content) {
        builder.data(JSON.stringify(content));
    }
}

