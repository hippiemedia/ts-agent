
export class AlpsJson
{
    constructor(router) {
        this.router = router;
    }

    supports(contentType) {
        return contentType.indexOf('application/alps+json') === 0
            || contentType.indexOf('application/json') === 0
        ;
    }

    accepts() {
        return 'application/alps+json, application/json, */*; q=0.01';
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

