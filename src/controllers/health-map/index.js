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
    user: 1,
    layout: 'layouts/noneLayout',
    locale: 'es',
    environment: 'development'
  });
});

module.exports = router;
