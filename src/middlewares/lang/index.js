
module.exports = (req, res, next)=>{

  const cookie = req.cookies.locale;

  if (!cookie) {
    let { session: { user } = {} }  = req;

    if(user && user.lang){
      console.log("setting lang from session  ",user.lang);
      res.cookie('locale',user.lang, { maxAge: 900000, httpOnly: true });
      req.i18n.setLocale( user.lang );
      next();
      return
    }

    res.cookie('locale','es', { maxAge: 900000, httpOnly: true });
    req.i18n.setLocale('es');
    next();
  }else{

    if( req.i18n.getLocale() !== cookie ){
      req.i18n.setLocaleFromCookie();
    }
    next();
  }
}




