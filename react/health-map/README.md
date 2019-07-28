# Monitor

This project includes the GYE Health Map source code. Use this library to render the Health Map module. Versions need to be managed in the `webpack.config.dev.js` and `webpack.config.prod.js` files.


### Usage

Include these files in your page:

Development:
```html
<link href="/health-map/dist/health-map.${VERSION}.css" rel="stylesheet">
<script src="/health-map/dist/health-map.${VERSION}.js" type="text/javascript"></script>
```

Production:
```html
<link href="https://cdn.shippify.co/dash/src/health-map/health-map.${VERSION}.css" rel="stylesheet">
<script src="https://cdn.shippify.co/dash/src/health-map/health-map.${VERSION}.js" type="text/javascript"></script>
```


### Render
```js
HealthMap.init(
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
  $ npm run healthmap:dev
```


### Deployment

```sh
  $ npm install
  $ npm run healthmap:prod
```
