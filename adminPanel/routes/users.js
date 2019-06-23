const express = require('express');
const router = express.Router();


//User Model
let User = require('../models/user');

//REgister form
router.get('/register',function(req,res){
    res.render('register');
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

        newUser.save(function (err) {
            if(err){
                console.log(err);
                return;
            }else{
                // req.flash('success','Your are registered');
                console.log("Success")
                res.redirect('/users/login');

            }
        });
    // }
    // console.log(name);
});

router.get('/login', function(req,res){
    res.render('login');
})
module.exports = router;