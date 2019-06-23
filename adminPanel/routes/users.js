const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const passport = require('passport');
let csrf =  require('csurf');
const validation = require('express-validator')

let csrfProtection = csrf();
router.use(csrfProtection);

//User Model
let User = require('../models/user');

//REgister form
router.get('/register',function(req,res,next){
    let messages = req.flash('error');
    res.render('register',{csrfToken: req.csrfToken(), messages: messages, hasErrors : messages.length > 0});
});

router.post('/register',function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;


 
        let newUser = new User({
            name : name,
            email : email,
            username : username,
            password : password
        });

        bcrypt.genSalt(10,function(err, salt){
            bcrypt.hash(newUser.password,salt, function(err,hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        // req.flash('success','Your are registered');
                        console.log("Success")
                        res.redirect('/users/login');
        
                    }
                })
            });
        })
        
    // }
    // console.log(name);
});
//login
router.get('/login', function(req,res){
    let messages = req.flash('error');
    // res.render('login');
    res.render('login',{csrfToken: req.csrfToken(), messages: messages, hasErrors : messages.length > 0});
});

//login process

router.post('/login', function(req,res,next){
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});
router.get('/logout',function(req,res){
    req.logOut();
    req.flash('success','Your are logged out');
    res.redirect('/users/login');
})
module.exports = router;