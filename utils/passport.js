const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

/*

function initialize(passport,getUserByEmail,getUserById) {
  console.log("starting passport");
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    console.log("user", user);
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

*/

function initialize(passport,getUserByEmail,getUserById) {
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
  passport.use(new LocalStrategy({
          usernameField: 'email',
          passwordField: 'password',
          passReqToCallback: true
      },
      async (req, email, password, done) => {
          try {
              await getUserByEmail(email).then(async (user) => {
                  if (!user) {
                      return done(null, false, req.flash("errors", `This user email "${email}" doesn't exist`));
                  }
                  if (user) {
                    console.log("CHECKING PW:", password);
                      let match = await bcrypt.compare(password, user.password);
                      console.log("AND?", match);
                      if (match === true) {
                          return done(null, user, null)
                      } else {
                          return done(null, false, req.flash("errors", match)
                          )
                      }
                  }
              });
          } catch (err) {
              console.log(err);
              return done(null, false, { message: err });
          }
      }));

};





module.exports = initialize