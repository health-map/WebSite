'use strict';
const Express = require('express');
const router = new Express.Router();

/**
 *
 */
router.get('/institutions', (req, res)=>{
  return res.render('panels/institutions', {
    urlApi: process.env.SHIPPIFY_API_URL,
    layout: 'layouts/noneLayout'
  });
});


/**
 *
 */
router.get('/info', (req, res)=>{

    return res.render('panels/info', {
      urlApi: process.env.SHIPPIFY_API_URL,
      layout: 'layouts/noneLayout'
    });
});

module.exports = router;