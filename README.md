
# hippiemedia/agent

## TL;DR

``` js
import factory from 'hippiemedia/agent';

agent = factory();
agent
    .follow('http://haltalk.herokuapp.com/')
    .then(console.log.bind(console))
;
```

## What ?

An hypermedia agent capable of discovering and navigating a web of linked resources.

## How ?

    npm install
    npm run build


## Why ?

The current state of http APIs sucks. Everybody makes its own shit in its own corner  
without embracing what made the web so successful (hateoas, links, auto-discovery, ...)

[json-ld](http://json-ld.org/) + [hydra](http://www.hydra-cg.com/) is the future, yet everybody tries to replace poor REST with graphql,  
thinking that graphql replaces REST (while it's only complementary at best),  
thinking that client-side-hardcoded-server-structure is better than auto-discovered, self-documented, smart[1] clients,  
thinking that json is better that xml,  
thinking that raw-data structures worth anything without its semantics,  
thinking that hardcoding URLs client-side and API versioning is better than letting the server do the job.
/rant

[1] smart clients are actually dumb: they know as much about your API than firefox knows about just another [mother fucking website](http://motherfuckingwebsite.com/).  
Yet this very same browser is capable of displaying it and any other website. Now who's dumb?

## How ?

Just create an agent. It's like your browser, but it understands more hypermedia formats: 

 - html
 - ld+json
 - hal+json
 - vnd.api+json
 - collection+json
 - uber+json
 - your own adapter...

This agent is capable of fetching a resource, parsing its content based on its content type,  
and populating a `Resource` object with operations, links, items and queries.

### Operations

You can apply some [operations](http://www.hydra-cg.com/spec/latest/core/#hydra:Operation) on a resource, like `POST`ing a new resource to a collection, or `DELETE` a resource.

```js
agent.follow('http://some-hypermedia-api.com/resource1')
.then(res => {
    return res.operation('comment').fill({
        author: 'me',
        text: 'fuck yeah'
    })
    .submit();
});
```
### Links

You can follow links as you follow links in your browser.

```js
agent.follow('http://some-hypermedia-api.com/resource1')
.then(res => {
    console.log(res.links());
    return res.link('comments').follow();
})
```

### Queries

Collections are often queryable or filterable. Might be able to use URI-templates.

```js
agent.follow('http://some-hypermedia-api.com/resource1')
.then(res => {
    console.log(res.queries());
    return res.query('search').by({
        author: 'me',
        since: 'yesterday'
    })
})
.then(res => {
    console.log(res.items());
});
```

### Items

Last but not least, items are the actual content of your resource.  
Each item is represented by its own `Resource` object, so you can operate on each embedded item as a separate resource.

```js
agent.follow('http://some-hypermedia-api.com/resource1')
.then(res => {
    res.items()[0].follow('self');
});
```
