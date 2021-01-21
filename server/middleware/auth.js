const models = require('../models');
const Promise = require('bluebird');
const cookieParser = require('./cookieParser');

module.exports.createSession = (req, res, next) => {
  cookieParser(req, res);

  // console.log('OUR COOKIE: --------->  ' + JSON.stringify(req.cookies) + '\n');
  // console.log(req.cookies);

  if (Object.keys(req.cookies).length === 0) {
    console.log('-----no cookies on request!-----');
    models.Sessions.create() // our hash to be saved into database
      .then((queryResults) => {
        return models.Sessions.get({id: queryResults.insertId});
      }).then((sessionObj) => {
        console.log('$$$$$$$$$$$$$$sessionObj ->');
        console.log(sessionObj.hash);
        req.session = { hash: sessionObj.hash };
        console.log(typeof (req.session));
      });
  } else {

  }

  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
