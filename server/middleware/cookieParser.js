

const parseCookies = (req, res, next) => {
  // res.cookie('name', 'shortly');
  // res.cookie('cookie1', 'chocolate');
  // res.cookie('cookie2', 'white chocolate');
  
  var cookieObj = {};
  if (!req.headers.cookie) { 
    req.headers.cookie = ''; 
    next();
  }
  var cookiesArr = req.headers.cookie.split(';');
  cookiesArr.forEach((el)=>{
    var keyVal = el.split('=');
    var key = keyVal[0].trim();
    var val = keyVal[1].trim();
    cookieObj[key] = val;
  });
  
  req.cookie = cookieObj;
  //console.log(cookieObj);
  next();
};

module.exports = parseCookies;