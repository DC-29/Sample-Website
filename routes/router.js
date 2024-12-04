const { ObjectId } = require('mongodb')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const initialisePassport = require('../passport-config')
const passport = require('passport')
const express = require('express')
const router = express.Router()

initialisePassport(
    passport, 
    async username => await User.findOne({username:username}),
    async id => await User.findOne({_id:new ObjectId(id)})
  )
  
router.get('/', function(req,res){
    if (req.user){
        res.render('index.html' , {user:req.user.username})
    }else{
        res.render('index.html', {user:null})
    }

})

router.get('/login',checkNotAuth,function(req,res){
res.render('login.ejs')
})

router.post('/login',passport.authenticate('local',{
successRedirect: '/',
failureRedirect: '/login',
failureFlash:true
}))

router.get('/register',checkNotAuth,function(req,res){
res.render('register.ejs')
})

router.post('/register',async function(req,res){
try{
    let hashed_password = await bcrypt.hash(req.body.password,10)
    let user = new User({
        username: req.body.username,
        password: hashed_password
    })
    await user.save()
    res.redirect('/login')
}catch{
    res.redirect('/register')
}
})

router.get('/logout',function(req,res){
req.logOut((err)=>{
    if (err){
        return next(err)
    }
    res.redirect('/login')   
})

})


function checkAuth(req,res,next){
if (req.isAuthenticated()){
    return next()
}
else{
    res.redirect('/login')
}
}

function checkNotAuth(req,res,next){
if (!req.isAuthenticated()){
    return next()
}
else{
    res.redirect('/')
}
}



router.get('/products',function(req,res){
    var fs = require('fs');
    var files = fs.readdirSync('./public/product');

    for (let i = 0; i < files.length ; i++){
        console.log(files[i])
    }
    if (req.user){
        res.render('gallery.html' , {user:req.user.username, files:files})
    }else{
        res.render('gallery.html', {user:null, files:files})
    }
})

module.exports = router