
export class JsonLd
{
    constructor(router) {
        this.router = router;
    }

    supports(contentType) {
        return contentType.indexOf('application/ld+json') === 0;
    }

    accepts() {
        return 'application/ld+json, application/json, */*; q=0.01';
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

