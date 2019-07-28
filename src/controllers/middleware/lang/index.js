
// require the db reader
const mmdbreader = require('maxmind-db-reader');
const I18n = require('i18n-2');

const i18n = new (I18n)({
  locales: ['en', 'pt','es']
});

function getLangByIp(req, res, next) {


  var cookie = req.cookies.locale;
  if (cookie === undefined) {
    let user = {}
    if(req.session && req.session.user){
      user = req.session.user
    }

    if(user.lang){
      console.log("setting lang from session  ",user.lang);
      res.cookie('locale',user.lang, { maxAge: 900000, httpOnly: true });
      req.i18n.setLocale(user.lang);
      next();
      return
    }

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if(ip.indexOf(",")>0){
      ip=ip.split(",")[0];
    }

    mmdbreader.open('./geodb/countries.mmdb',function(err,countries){

      try{

        countries.getGeoData(ip,function(err,geodata){
          if(err || geodata==null){
            res.cookie('locale','en', { maxAge: 900000, httpOnly: true });
            req.i18n.setLocale('en');
          }
          else if(geodata.country.iso_code=="BR"){
            res.cookie('locale','pt', { maxAge: 900000, httpOnly: true });
            req.i18n.setLocale('pt');
          }
          else if(geodata.country.iso_code=="US"){
            res.cookie('locale','en', { maxAge: 900000, httpOnly: true });
            req.i18n.setLocale('en');
          }
          else{
            res.cookie('locale','es', { maxAge: 900000, httpOnly: true });
            req.i18n.setLocale('es');
          }
          //req.i18n.setLocaleFromCookie();console.log("lang brow "+req.headers["accept-language"]);
          next();
        });

      }//end try
      catch(e){

        console.log("Invalid IP "+ip+" ex "+e.toString());
        res.cookie('locale','en', { maxAge: 900000, httpOnly: true });
        req.i18n.setLocale('en');
        next();
        //exception of IP invalid
      }
    });
  }
  else
  {

    if(req.i18n.getLocale()!=cookie){
      req.i18n.setLocaleFromCookie();
    }

    next();
  }
}



module.exports = getLangByIp;
