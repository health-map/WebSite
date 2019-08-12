'use strict';
const Express = require('express');
const router = new Express.Router();

/**
 *
 */
router.get('/institutions', (req, res)=>{
  return res.render('panels/institutions', {
    urlApi: process.env.SHIPPIFY_API_URL,
    layout: 'layouts/noneLayout',
    user: req.session ? req.session.user : undefined
  });
});


/**
 *
 */
router.get('/info', (req, res)=>{

    return res.render('panels/info', {
      urlApi: process.env.SHIPPIFY_API_URL,
      layout: 'layouts/noneLayout',
      user: req.session ? req.session.user : undefined
    });
});

module.exports = router;