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


  // const redis = require('./services/storage/redis');

  const morgan = require('morgan');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');

  const app = new Express();

  const session = require('express-session');
  // const RedisStore = require('connect-redis')(session);
  const path = require('path');
  const engine = require('ejs-locals');
  const expressLayouts = require('express-ejs-layouts');
  // const sessionAuth = require('./controllers/middleware/auth').sessionAuth;
  // const User = require('./models/user');

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

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(Express.static(path.join(__dirname, 'public')));
  app.use(Express.static(path.join(__dirname, '../react')));

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

  // app.use(session({
  //   store: new RedisStore({
  //     client: redis.connect()
  //   }),
  //   secret : 'health-map',
  //   resave: false,
  //   saveUninitialized: false
  // }));


  // app.use(require('./controllers/admin'));

  app.set('views', [path.join(__dirname , 'views'), path.join(__dirname, '..', 'admin', 'build') ]);

  app.use('/health-map', require('./controllers/health-map'));

  app.use(Express.static(path.resolve(__dirname, '..', 'admin', 'build'), { index: false }));
  app.use('/views/assets', Express.static(path.resolve(__dirname, '..', 'admin', 'views', 'assets')));

  /**
   *
   */
  // app.use('/*', sessionAuth, (req, res) => {
  //   User.getFlag({
  //     user_id: req.session.user.id,
  //     type: 'tutorial_monitor'
  //   }, (error, flag) => {
  //     return res.render('index.ejs', {
  //       tutorial: false,
  //       locale: 'es',
  //       user: req.session.user,
  //       environment: req.session.user.environment,
  //       companyAccess: req.session.user.companyAccess,
  //       layout:'./layouts/publiclayout'
  //     });
  //   });
  // });


  app.listen(port, host,() =>{
    console.log(`Health Map web server listening on http://${host}:${port} with the worker ${process.pid}`);
  });
}