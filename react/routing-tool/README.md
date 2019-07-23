# Monitor

This project includes the Routing source code. Use this library to render the Routing module. Versions need to be managed in the `webpack.config.dev.js` and `webpack.config.prod.js` files.


### Usage

Include these files in your page:

Development:
```html
<link href="/routing/dist/routing.${VERSION}.css" rel="stylesheet">
<script src="/routing/dist/routing.${VERSION}.js" type="text/javascript"></script>
```

Production:
```html
<link href="https://cdn.shippify.co/dash/src/routing/routing.${VERSION}.css" rel="stylesheet">
<script src="https://cdn.shippify.co/dash/src/routing/routing.${VERSION}.js" type="text/javascript"></script>
```


### Render
```js
Routing.init(
  {
    user,
    translations
  },
  domElement
);
```


### Development

```sh
  $ npm install
  $ npm run routing:dev
```


### Deployment

```sh
  $ npm install
  $ npm run routing:prod
```
