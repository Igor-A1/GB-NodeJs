const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

module.exports = passport => {
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => 
    User.model.findById(id, (e, user) => done(e, user))
  )

  passport.use('local-login', new LocalStrategy(
    {
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, login, password, done) => {
      User.model.findOne({'login': login}, (err, user) => {
        if(e) return done(e)
          
        if (!user)
          return 
            done(null, false, req.flash('loginMessage', 
              'Что-то не могу найти такого пользователя.'))

        if (!user.isValidPassword(password))
          return 
            done(null, false, req.flash('loginMessage', 
              'Опаньки, пароль не подходит!'))

            return done(null, user)
      })
    }
  ))

  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, login, password, fullname, email, done) => {
      User.model.findOne({'login': login}, (e, user) => {
        if (e) return done(e)

        if (user) {
          return 
            done(null, false, req.flash('signupMessage', 
              'Сорри, такой логин уже занят.'))
        } else {
          const newUser = new User.model()

          newUser.login = login
          newUser.password = newUser.genHash(password)
          newUser.fullname = fullname
          newUser.email = email
          newUser.save(e => {
              if (e) throw e
              return done(null, newUser)
          })
        }
      })
    }
  ))

}