module.exports = (req, res, next)=>{
    if(req.session == null || req.session.user == null ){
      console.log('req.method:',req.method)
      if(req.method === 'get' || req.method === 'GET'){ // right way to solve this
        return res.redirect('/login');
      }
      return res.status(403).message({ code: 'UA', message: 'Unauthenticated'})
    }
    next();
}
