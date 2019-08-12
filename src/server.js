const cluster = require('cluster')

if(cluster.isMaster) {
    const numWorkers = (process.env.SHIPPIFY_SERVER_ENV === 'production') ?
      require('os').cpus().length :
      1;

    console.log('Master cluster setting up ' + numWorkers + ' workers...')

    for(let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker)=>{
        console.log('Worker ' + worker.process.pid + ' is online')
    })

    cluster.on('exit', (worker, code, signal)=>{
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal)
        console.log('Starting a new worker')
        cluster.fork()
    })

}else{

  'use strict';

  const host = process.env.SHIPPIFY_APP_HOST || '0.0.0.0'
  const port = process.env.SHIPPIFY_APP_PORT || 8030
  const env = process.env.SERVER_ENV || 'development';

  const Express = require('express');


  const redis = require('./services/storage/redis');

  const morgan = require('morgan');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  const I18n = require('i18n-2');
  const app = new Express();

  const session = require('express-session');
  const RedisStore = require('connect-redis')(session);
  const path = require('path');
  const engine = require('ejs-locals');
  const expressLayouts = require('express-ejs-layouts');
  const auth = require('./middlewares/auth');
  const lang = require('./middlewares/lang');

  const allowCrossDomain = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && origin.endsWith('shippify.co')) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader("Access-Control-Allow-Headers", "Authorization, X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Accept");
    }
    next();
  }

  app.engine('ejs', engine);
  app.set('view engine', 'ejs');
  app.use(expressLayouts);

  app.use(morgan(env === 'production' ? 'combined' : 'dev'));

  app.use(cookieParser());

  /**bodyParser.json(options)
   * Parses the text as JSON and exposes the resulting object on req.body.
  */

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(Express.static(path.join(__dirname, 'public')));
  app.use(Express.static(path.join(__dirname, '../react')));

  I18n.expressBind(app, {
    locales: ['en', 'es'],
    defaultLocale: 'es',
    cookieName: 'locale'
  });

  app.get('/ping', (request, response) => {
    response.contentType('application/json');
    return response.json({ ping: 'PONG' });
  });

  app.use(allowCrossDomain);

  function redirectSecure(req, res, next) {
      if (req.headers['x-forwarded-proto'] === 'https') {
          return next();
      } else {
          res.redirect('https://' + req.headers.host + req.path);
      }
  }

  if(process.env.SHIPPIFY_SERVER_ENV === 'production'){
      app.use(redirectSecure);
  }

  app.use(session({
    store: new RedisStore({
      client: redis.connect()
    }),
    secret : 'health-map',
    resave: false,
    saveUninitialized: false
  }));


  app.set('views', [path.join(__dirname , 'views'), path.join(__dirname, '..', 'admin', 'build') ]);


  app.get('/lang/:locale', auth, lang, (req, res) => {
    const { params: { locale } = {} } = req;

    console.log('*********************');
    console.log("LANGUAGE SELECTED: " + locale);
    console.log('*********************');
    if (!locale) {
      return res.status(422).json({ code: 'PF', message: "Missing Parameters" });
    }
    if(!req.i18n.locales[locale]) {
      return res.status(422).json({ code: 'PF', message: `There is no locale lang configured with ${locale}` });
    }

    res.cookie('locale', locale);
    req.i18n.setLocale(locale);
    req.i18n.setLocaleFromCookie();
    return res.redirect('/')
  });


  app.use(require('./controllers/admin'));
  app.use(require('./controllers/subsections'));

  app.use(['/', '/health-map/'], auth, lang, (req, res)=>{

    const user = (req.session && req.session.user) ? 
    {
      ...req.session.user,
      apiUrl: 'http://localhost:8020',
      apiToken: req.session.user.api_token,
      password: undefined
    } : 
    { // anonymous user
      apiUrl: 'http://localhost:8020',
      apiToken: 'YW5vbnltb3VzQGhlYWx0aG1hcC5jb206MTIzNA=='
    }

    return res.render('panels/healthMap', {
      apiUrl: process.env.SHIPPIFY_API_URL,
      user: user,
      layout: 'layouts/noneLayout',
      locale: 'es',
      environment: 'development'
    });
  });

  app.use(Express.static(path.resolve(__dirname, '..', 'admin', 'build'), { index: false }));
  app.use('/views/assets', Express.static(path.resolve(__dirname, 'views', 'assets')));

  app.listen(port, host,() =>{
    console.log(`Health Map web server listening on http://${host}:${port} with the worker ${process.pid}`);
  });
}