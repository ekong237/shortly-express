const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // var sessionID;
  
  console.log('createsessioin middleware');
  // if (req.cookie )
  if (!req.cookie.sessionID) {
    console.log('cookie>>>>>>>', req.cookie);
    models.Sessions.create()
      .then((obj) => {
        console.log('obj:', obj);
        return models.Sessions.get({ id: obj.insertId })
          .then((rowObj) => {
            console.log(rowObj);
            res.cookie('sessionID', rowObj.hash);
            next();
          });
        
      });
  } else {
    next();
  }
  
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  // don't create session id, redirect them to login
  models.Sessions.get({ hash: req.cookie.sessionID})
    .then((session) => {
      if (session && session.user) {
        if (req.url === '/login') {
          res.redirect('/');
        } else {
          next();
        }
        
      } else {
        res.redirect('/login');
      }
    });
};