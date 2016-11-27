
import Adapter from '../adapter';
export default class UberJson implements Adapter
{
    supports(contentType) {
        return contentType.includes('application/vnd.uber-amundsen+json');
    }

    accepts() {
        return 'application/vnd.uber-amundsen+json';
    }

    build(builder, text) {
        this.fromObject(builder, JSON.parse(text).uber);
    }

    fromObject(builder, content) {
        builder.data(content);
        content.data.forEach(data => {
            if (data.rel) {
                data.rel.forEach(rel => {
                    builder.profiles({
                        rel: data.url || rel,
                        url: data.url || rel
                    });
                });
            }
            if (data.templated) {
                builder.queries({
                    rel: data.name,
                    url: data.url
                });
            }
            if (data.action) {
                builder.operations({
                    method: this.method(data.action),
                    rel: data.name,
                    url: data.url,
                    data: data.model
                });
            }
            builder.items(data);
        });
    }

    method(action) {
        const map = {
            'append': 'POST',
            'partial': 'PATCH',
            'read': 'GET',
            'remove': 'DELETE',
            'replace': 'PUT'
        };
        return map[action] || action;
    }
}

