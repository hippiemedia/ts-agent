
import Link from '../link';
import Resource from '../../resource';

export class Collection
{
    public readonly all: Link[];

    constructor(links: Link[] = []) {
        this.all = links;
    }

    follow(rel, fields = {}, criteria = () => true): Promise<Resource>
    {
        let link = this.all.filter(link => link.rel === rel).find(criteria);
        if (link) {
            return link.follow(fields);
        }
        return Promise.reject(new Error(`no such link relation "${rel}" in "${this.all}"`));
    }
}
