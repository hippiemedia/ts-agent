
export class AlpsXml
{
    constructor(alpsJson) {
        this.alpsJson = alpsJson;
    }

    supports(contentType) {
        return contentType.indexOf('application/alps+xml') === 0
            || contentType.indexOf('text/xml') === 0
        ;
    }

    accepts() {
        return 'application/alps+xml, text/xml, */*; q=0.01';
    }

    build(builder, text) {
        this.fromObject(builder, text);
    }

    fromObject(builder, content) {
    }
}

