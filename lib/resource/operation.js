
export class Operation
{
    constructor(resource, rel, method, url, data) {
        this._resource = resource;
        this.rel = rel;
        this.method = method;
        this.url = url;
        this.data = data;
    }

    fill(data) {
        this.data = data;
    }

    submit() {
        return this._resource.operate(this.method, this.url, this.data);
    }

    meaning() {
        return this._resource.meaningOf(this.rel);
    }
}
