
export class Fallback
{
    constructor(agent) {
        this.agent = agent;
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

