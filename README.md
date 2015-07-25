

``` js

var router = new Router([new CollectionJson()], new HttpClient(), client);

router.follow(`${window.location.origin}/root.json`)
.then(res => {
    return res.items()[0].link('self').follow();
})
.then(res => {
    return res.link('self').follow();
})
.then(res => {
    console.log(res.operations());
});

```
