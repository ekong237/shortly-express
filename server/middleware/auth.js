const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  
  
  console.log('createsessioin middleware');
  // 
  if (!req.cookie.sessionID) {
    console.log('cookie>>>>>>>', req.cookie);
    models.Sessions.create()
      .then((databaseResponseObj) => {
        console.log('databaseResponseObj:', databaseResponseObj);
        return models.Sessions.get({ id: databaseResponseObj.insertId })
          .then((sessionRowMatch) => {
            console.log(sessionRowMatch);
            res.cookie('sessionID', sessionRowMatch.hash);
            next();
          });
        
      });
  } else {
    models.Sessions.get({hash: req.cookie.sessionID})
      .then(sessionRowMatch => {
        console.log('session row match', sessionRowMatch);
        return sessionRowMatch ? true : false;
      })
      .then(hasSessionRowMatch => {
        if (hasSessionRowMatch) {
          throw {};
        } else {
          return models.Sessions.create();
        }
      })
      .then(databaseResponseObj => {
        if (databaseResponseObj) {
          return models.Sessions.get({id: databaseResponseObj.insertId});
        } 
      })
      .then(sessionRowMatch => {
        if (sessionRowMatch) {
          res.cookie('sessionID', sessionRowMatch.hash);
          next();
        } 
      })
      .catch(() => {
        next();
      });
  }
  
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  console.log('verify session');
  // don't create session id, redirect them to login
  models.Sessions.get({ hash: req.cookie.sessionID})
    .then((session) => {
      if (session && session.user) {
        console.log('has session and session ID');
        if (req.url === '/login') {
          console.log('redirect to home because user is alrady logged in');
          res.redirect('/');
        } else {
          console.log('user is alrady logged in, not attempting to login again');
          next();
        }
        
      } else {
        console.log('user not logged in');
        if (req.url === '/login') {
          next();
        } else {
          res.redirect('/login');
        }
        
      }
    });
};