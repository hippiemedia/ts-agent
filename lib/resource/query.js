
export class Query
{
    constructor(resource, rel, url) {
        this._resource = resource;
        this.rel = rel;
        this.url = url;
    }

    with(data) {
        return this._resource.follow(this.url, data);
    }

    meaning() {
        return this._resource.meaningOf(this.rel);
    }
}
