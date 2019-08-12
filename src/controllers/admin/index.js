'use strict';
const Express = require('express');
const router = new Express.Router();
const User = require('./../../models/user');
const auth = require('../../middlewares/auth');
const lang = require('../../middlewares/lang');

/**
 *
 */
router.post('/logout', (req, res)=>{
    req.session.destroy(() => {
      res.redirect('/info');
    });
});

/**
 *
 */
router.get('/logout', (req, res)=>{
  req.session.destroy(() => {
    res.redirect('/info');
  });
});


/**
 *
 */
router.get('/login', lang, (req, res)=>{
    if (req.session && req.session.user) {
      return res.redirect('/info');
    }

    return res.render('panels/login', {
      urlApi: process.env.SHIPPIFY_API_URL,
      layout: 'layouts/noneLayout',
      user: req.session ? req.session.user : undefined
    });
});


router.post('/login', (req, res) => {

    const origin = req.headers.origin;

    console.log('origin', origin);

    console.log('BODY:', req.body);
    
    const { email, password } = req.body

    if (!email) {
      return res.status(400).json({
        code: 'PF',
        message: 'Email es requerido'
      })
    }
    if (!password) {
      return res.status(400).json({
            code: 'PF',
            message: 'Contraseña es requerida'
      })
    }
    User.login({ email, password }, (error, users) => {
        if (error) {
            console.log("Error ==== "+error);
            return res.status(error.statusCode).json({
                code: error.code,
                message: error.message
            })
        }
        if (!users.length) {
            return res.status(404).json({
                code: 'NF',
                message: 'Not found user'
            })
        }

        const user = users[0];

        req.session.user = user;

        res.redirect('/info');
    })
})  
  




module.exports = router;
