'use strict';
const respondUtils = require('./../../utils/respond');
module.exports = {
  sessionAuth: (req, res, next)=>{
    if(req.session == null || req.session.user == null ){
      console.log('req.method:',req.method)
      if(req.method === 'get' || req.method === 'GET'){ // right way to solve this
        return res.redirect('/login');
      }
      return respondUtils.unauthenticated(res);
    }
    next();
  },
  partialAuth: (req, res, next)=>{
    if(req.session == null || req.session.user == null ){
      res.type("text/html");
      return res.send('<span></span>');
    }
    next();
  }
};
