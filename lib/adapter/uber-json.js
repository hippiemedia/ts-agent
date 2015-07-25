
export class AlpsJson
{
    constructor(router) {
        this.router = router;
    }

    supports(contentType) {
        return contentType.indexOf('application/vnd.uber-amundsen+json') === 0;
    }

    accepts() {
        return 'application/vnd.uber-amundsen+json, */*; q=0.01';
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
                    rel: query.name,
                    url: query.url
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

    function method(action) {
        const map = {
            'append': 'POST',
            'partial': 'PATCH',
            'read': 'GET',
            'remove': 'DELETE',
            'replace': 'PUT'
        };
        return map.action || action;
    }
}

