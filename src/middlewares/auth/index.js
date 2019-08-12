const User = require('./../../models/user');
module.exports = (req, res, next)=>{
    if(req.session == null || req.session.user == null ){
      console.log('req.method:',req.method)
      if(req.method === 'get' || req.method === 'GET'){ // right way to solve this
        return User.login({ email: 'anonymous@healthmap.com', password: '1234' }, (error, users)=>{
          if(error){
            return res.status(error.statusCode).json({ code: error.code, message: error.message})
          }
          next();
          return;
        })
      }
      return res.status(403).json({ code: 'UA', message: 'Unauthenticated'})
    }
    next();
    return;
}
