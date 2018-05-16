"use strict";
const passport = require("passport");
const bCrypt = require("bcrypt-nodejs");

const generateHash = password => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8));
};

module.exports.register = (req, res, next) => {
  const User = req.app.get("models").User;
  User.findOne({where: {email: req.body.email}})
  .then(data=>{
    if (!data){
      User.create({
        email: req.body.email,
        password: generateHash(req.body.password)
      }).then(newUser=>{
        res.status(200).json(newUser);
      });
    } else {
      console.log('bummer, its a match');
    }
  });
};

module.exports.login = (req, res, next) => { 
  const User = req.app.get("models").User;
  User.findOne({ where: { email: req.body.email } })
  .then(authUser => {
    if(!authUser) console.log('no matching user');
    if (bCrypt.compareSync(req.body.password, authUser.password)){
      res.status(200).json(authUser);
    } else {
      console.log('not a matching password');
    }
  }).catch(err=>{
    console.log(err);
  });
};




// module.exports.register = (req, res, next) => {
//   console.log('user', req.body);
//   // if (req.body.password === req.body.confirmation) { // move to client validation
//   console.log("Trying to register new user");

//   // first argument is name of the passport strategy we created in passport-strat.js
//   passport.authenticate("local-signup", (err, user, msgObj) => {
//     console.log("Where are we? session.js", user);

//     if (err) {
//       return next(err);
//     }

//     if (!user) {
//       console.log("Error registering", msgObj.message);
//       res.status(409); //Conflict.  This code is debatable. Seems best suited to me.
//       res.json({ message: msgObj.message });
//     }

//     // Go ahead and login the new user once they are signed up
//     req.logIn(user, err => {
//       if (err) {
//         return next(err);
//       }
//       console.log("authenticated!", user);
//       let currentUser = { username: user.username, id: user.id };
//       res.status(200).json(currentUser);
//     });
//   })(req, res, next);
// };

// module.exports.login = (req, res, next) => {
//   // Note we're using different strategy, this time for logging in
//   passport.authenticate("local-signin", (err, user, msgObj) => {
//     // If login fails, the error is sent back by the passport strategy as { message: "some msg"}
//     console.log("error msg?", msgObj);

//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       console.log("Error logging in, man", msgObj.message);
//       res.status(401); //(Unauthorized) status code indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.
//       res.json({ message: msgObj.message });
//     }

//     req.logIn(user, err => {
//       if (err) {
//         return next(err);
//       }
//       console.log("authenticated", user);
//       res.status(200).json({ username: user.username, id: user.id });
//     });
//   })(req, res, next); // note that authenticate() is called from within the route handler, rather than being used as route middleware. This gives the callback access to the req and res objects through closure.
// };

// // logging out
// module.exports.logout = (req, res, next) => {
//   req.session.destroy(function (err) {
//     if (err) return next(err);

//     res.status(200).end();
//   });
// };
