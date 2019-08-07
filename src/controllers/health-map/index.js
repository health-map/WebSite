'use strict';
const Express = require('express');
const router = new Express.Router();


/**
 *
 */
// router.get('/', sessionAuth, getLangByIp, (req, res) => {
router.get('/', (req, res) => {
  return res.render('panels/healthMap', {
    urlApi: process.env.SHIPPIFY_API_URL,
    user: {
      apiUrl: 'http://localhost:8020',
      apiToken: 'YWJjZGU6YWJjZGU='
    },
    layout: 'layouts/noneLayout',
    locale: 'es',
    environment: 'development'
  });
});

module.exports = router;
