# httpuv

**httpuv** is a node.js library for making http requests with a clear API and zero dependencies.

- Simple API
- Lightweight ( **< 3 KB** )
- Zero dependencies

## API

##### GET
```
httpuv.get(url[, { [headers]: { ... }, [query]: { ... } }]);
```
##### POST
```
httpuv.post(url[, { [headers]: { ... }, [query]: { ... }, [body]: ... }]);
```
##### PUT
```
httpuv.put(url[, { [headers]: { ... }, [query]: { ... }, [body]: ... }]);
```
##### PATCH
```
httpuv.patch(url[, { [headers]: { ... }, [query]: { ... }, [body]: ... }]);
```
##### DELETE
```
httpuv.delete(url[, { [headers]: { ... }, [query]: { ... } }]);
```

## Usage
```javascript
const httpuv = require('httpuv');

...
// inside async function
// Getting data with query params
const response = await httpuv.get('https://foo.com/bar', {
  query: { baz: 1 }
}); // results in GET https://foo.com/bar?baz=1


...
// inside async function
// Posting a data with headers
const result = await httpuv.post('https://foo.com/bar', {
  body: { baz: 1 },
  headers: { 'Authentication': 'Bearer ...' },
})
  
```
