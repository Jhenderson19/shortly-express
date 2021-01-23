const parseCookies = (req, res, next) => {
  console.log('begin cookie parser....');
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

  next ? next() : undefined;
};

module.exports = parseCookies;