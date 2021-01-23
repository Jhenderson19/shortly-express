const models = require('../models');
const Promise = require('bluebird');
const cookieParser = require('./cookieParser');

module.exports.createSession = (req, res, next) => {
  console.log('begin create session');

  // creating a new session
  if (Object.keys(req.cookies).length === 0) { // if session dont exist create session by setting req.session and res.cookie()
    console.log('creating new session');
    models.Sessions.create() // our hash to be saved into database
      .then((queryResults) => {
        return models.Sessions.get({id: queryResults.insertId});
      }).then((sessionObj) => {

        req.session = { hash: sessionObj.hash };
        res.cookie('shortlyid', sessionObj.hash);

        next ? next() : undefined;
      });
  } else { // if session exist
    console.log('looking up previous session');
    req.session = { hash: req.cookies.shortlyid };
    models.Sessions.get({ hash: req.cookies.shortlyid}) // checking to see if there is a session
      .then( (sessionObj) => {
        if (sessionObj) {
          return models.Users.get({ id: sessionObj.userId });
        } else {
          req.headers.cookie = '';
          req.cookies = {};

          return models.Sessions.create()
            .then((queryResults) => {
              return models.Sessions.get({id: queryResults.insertId});
            }); // our hash to be saved into database
        }
      }).then((inputObj) => {
        if (inputObj.username) {
          req.session.user = {};
          req.session.user.username = inputObj.username;
          req.session.userId = inputObj.id;
        } else if (inputObj.hash) {
          req.session = { hash: inputObj.hash };
          res.cookie('shortlyid', inputObj.hash);
        }

        next ? next() : undefined;
      })
      .catch((err) => {
        // console.log('err ->', err);
        next ? next() : undefined;
      });

  }

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
