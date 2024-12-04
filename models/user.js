const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    username:{
        type: String,
        minLength: 5,
        maxLength: 20
    },
    password:{
        type:String,
        validate: {
            validator: function(v) {
              return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&]).{8,}/.test(v);
            }
        }
    }
})

module.exports = mongoose.model("User",userSchema)