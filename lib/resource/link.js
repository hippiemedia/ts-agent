
export class Link
{
    constructor(resource, rel, url) {
        this._resource = resource;
        this.rel = rel;
        this.url = url;
    }

    follow() {
        return this._resource.follow(this.url);
    }

    meaning() {
        return this._resource.meaningOf(this.rel);
    }
}
