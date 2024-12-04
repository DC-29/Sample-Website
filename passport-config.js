const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialise(passport, getUserByName, getUserById){
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByName(username)
        console.log(user)
        if (user == null) return done(null, false, {message: "No user found"})

        try{
            if (await bcrypt.compare(password,user.password)){
                return done(null,user)
            } else{
                return done(null, false, {message: "Password or Username doesn't match"})
            }
        } catch (e) {
            return done(e)
        }

    }
    passport.use(new LocalStrategy({},authenticateUser))
    passport.serializeUser((user,done)=> done(null,user._id))
    passport.deserializeUser(async (id,done) => done(null,await getUserById(id)))
}

module.exports = initialise