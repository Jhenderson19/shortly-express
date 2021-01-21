const parseCookies = (req, res, next) => {
  console.log('OUR COOKIE: --------->  ' + req.headers.cookie );
  var cookieList = {};
  var cookieString = req.headers.cookie;

  if (cookieString !== undefined) {
    cookieString.split(';').forEach((cookie) => {
      var kvPair = cookie.split('=');
      cookieList[kvPair[0].trim()] = kvPair[1];
    });
  }
  return cookieList;
};

module.exports = parseCookies;