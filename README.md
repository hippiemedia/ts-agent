
# hippiemedia/agent

## TL;DR

``` js
import factory from 'hippiemedia/agent';

agent = factory();
let resource = await agent.follow('http://haltalk.herokuapp.com/');
```

## What ?

An hypermedia agent capable of discovering and navigating a web of linked resources.


## How ?

    npm install hippiemedia/agent


### build webpack bundle

    npm install
    npm run build


Then you can create an agent. It's like your browser, but it understands more hypermedia formats: 

```js
import factory from '@hippiemedia/agent';

agent = factory();
```

 - html [ ]
 - ld+json (+hydra) [ ]
 - hal+json [x]
 - hal-forms [x]
 - vnd.api+json [ ]
 - collection+json [ ]
 - uber+json [ ]
 - your own adapter...

This agent is capable of fetching a resource, parsing its content based on its content type,  
and populating a `Resource` object with operations, links and queries.


## Discoverability

It's important to let the agent discover links instead of hardcoding them.  
You can do that by introspecting resources:

```js
let menu = resource.allLinks.map(link => render(`<a href="${link.href}">${link.rel}</a>`));

let actions = resource.operations.map(o => render(`<form method="${o.method}" action="${o.href}">
    ${o.fields.map(field => render(`<input type=${field.type} />`))}
</form>`));
```

### Operations

You can apply some [operations](http://www.hydra-cg.com/spec/latest/core/#hydra:Operation) on a resource, like `POST`ing a new resource to a collection, or `DELETE` a resource.

```js
let resource = await agent.follow('http://some-hypermedia-api.com/resource1');
let newResource = await resource.follow('comment').then(r => {
    r.operation('default').fill({
        author: 'me',
        text: 'fuck yeah'
    }).submit()
});
```

### Links

You can follow links as you follow them in your browser.

```js
let resource = await agent.follow('http://some-hypermedia-api.com/resource1');
console.log(resource.allLinks);
let comments = await resource.followAll('comments');
```

### Queries

Some links can be templated. You can expand them using:

```js
let found = await resource.follow('find', {name: 'yay', 'year': 2018});
```

## Why ?

The current state of http APIs sucks. Everybody makes its own shit in its own corner  
without embracing what made the web so successful (hateoas, links, auto-discovery, ...)

[json-ld](http://json-ld.org/) + [hydra](http://www.hydra-cg.com/) is the future, yet everybody tries to replace poor REST with graphql,  
thinking that graphql replaces REST (while it's only complementary at best),  
thinking that client-side-hardcoded-server-structure is better than auto-discovered, self-documented, dumb[1] clients,  
thinking that json is better that xml,  
thinking that raw-data structures worth anything without its semantics,  
thinking that hardcoding URLs client-side and API versioning is better than letting the server do the job.   
/rant

[1] dumb clients are actually smart: they know as much about your API than firefox knows about just another [mother fucking website](http://motherfuckingwebsite.com/).  
Yet this very same browser is capable of displaying it and any other website. Now who's smart?

