
export class Fallback
{
    constructor(router) {
        this.router = router;
    }

    supports(contentType) {
        return true;
    }

    accepts() {
        return '*/*';
    }

    build(builder, text) {
        builder.data(text);
    }
}

