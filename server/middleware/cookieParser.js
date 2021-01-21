const parseCookies = (req, res, next) => {
  // console.log('OUR COOKIE: --------->  ' + req.headers.cookie );
  var cookieList = {};
  var cookieString = req.headers.cookie;

  if (cookieString !== undefined) {
    cookieString.split(';').forEach((cookie) => {
      var kvPair = cookie.split('=');

      var key = kvPair[0].trim();
      var value = kvPair[1];

      cookieList[key] = value;
    });
  }

  req.cookies = cookieList;
  if(next) {
    next();
  }
};

module.exports = parseCookies;