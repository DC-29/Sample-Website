if (process.env.NODE_ENV != 'production'){
  require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

const router = require('./routes/router')

app.set('view-engine','ejs')
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'))


app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))
app.use(passport.session())
app.use(passport.initialize())
app.use(methodOverride('_method'))


const url = process.env.DB_URL;  

async function connectDB(url) {
  mongoose.connect(url);
  return "Connected to mongoDB"
}

connectDB(url).then(console.log).catch((error)=>{
  console.log(error)
})


app.use('/',router)


app.listen(3000)
