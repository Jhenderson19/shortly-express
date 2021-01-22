const models = require('../models');
const Promise = require('bluebird');
const cookieParser = require('./cookieParser');

module.exports.createSession = (req, res, next) => {
  console.log( '--------cookie length:::  '+Object.keys(req.cookies).length );

  // console.log(req.cookies);
  // console.log(req);
  if (Object.keys(req.cookies).length === 0) { // if session dont exist create session by setting req.session and res.cookie()

    models.Sessions.create() // our hash to be saved into database
      .then((queryResults) => {
        return models.Sessions.get({id: queryResults.insertId});
      }).then((sessionObj) => {

        req.session = { hash: sessionObj.hash };
        res.cookie('shortlyid', sessionObj.hash);

        next ? next() : undefined;
      });
  } else { // if session exist

    if ( req.cookies.shortlyid ) {

      req.session = { hash: req.cookies.shortlyid };

      models.Sessions.get({ hash: req.cookies.shortlyid})
        .catch((err) => {
          // delete cookie
        })
        .then( (sessionObj) => {
          return models.Users.get({ id: sessionObj.userId });
        }).then((userObj) => {
          req.session.user = {};
          req.session.user.username = userObj.username;
          req.session.userId = userObj.id;

          next ? next() : undefined;
        })
        .catch((err) => {
          console.log('err ->', err);
          next ? next() : undefined;
        })

    } else {
      next ? next() : undefined;
    }



  }

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
