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
let Employee = require('../models/employee');
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
router.get('/login',(req,res) => {
    let messages = req.flash('error');
    // res.render('login');
    res.render('login',{csrfToken: req.csrfToken(), messages: messages, hasErrors : messages.length > 0});
});

//login process

router.post('/login',(req,res,next) => {
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
});

router.get('/dashboard',(req,res,next) => {
    if(req.isAuthenticated())
        res.render('dashboard');    
    else
        res.redirect('/users/login');
});
router.get('/addEmp',function(req,res,next){
    if(req.isAuthenticated()){
        let messages = req.flash('error');
        res.render('addEmp',{title:'Add Employee',csrfToken: req.csrfToken(), messages: messages, hasErrors : messages.length > 0});
    }else
        res.redirect('/users/login');
   
});
//Insert Emp
router.post('/insert',function(req,res){

    let newEmp = new Employee({
        name: req.body.name,
        age:req.body.age,
        salary:req.body.salary,
        email:req.body.email,
        remarks:req.body.remarks

    });
    newEmp.save(function(err){
        if(err){
            console.log(err);
            return ;
        }else{
            console.log('Success');
            res.redirect('/users/dashboard');
        }
    });
});

//Display Emp
router.get('/display', function(req,res,next){
    // let resulArr =[];
    if(req.isAuthenticated()){
        Employee.find({},function(err, employes){
            if(err){
                console.log(err);
            }else{
                res.render('displayEmp',{items: employes,title:'Employe List'});
            }
        });
    }else{
        res.redirect('/users/login');
    }
    
    // let cursor = Employee.findOne({});
    // console.log(cursor);
    // cursor.forEach(function(doc,err){
    //     // assert.(null,err);
    //     resulArr.push(doc);
    // },  function(){
    //     res.render('displayEmp',{items:resulArr});
    // });
});
router.get('/update/:id',function(req,res,next){
    // console.log(req.params.id);
    if(req.isAuthenticated()){
        let messages = req.flash('error');
        Employee.findById(req.params.id,function(err,employes){
            res.render('editEmp',{csrfToken: req.csrfToken(), messages: messages, hasErrors : messages.length > 0,title:'Edit Employes',employe : employes});
        });
    }else{
        res.redirect('/users/login');
    }
    
});

router.post('/update/:id',function(req,res){
    let employe ={};
    employe.name = req.body.name;
    employe.age = req.body.age;
    employe.salary = req.body.salary;
    employe.email = req.body.email;
    employe.remarks = req.body.remarks;

    let query = { _id:req.params.id };
    Employee.updateOne(query,employe,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/users/display');
        }
    })
});
router.get('/delete/:id',function(req,res){
    let query = {_id:req.params.id};
    Employee.deleteOne(query,function(err){
        if(err){
            console.log(err);
        }else{
            console.log('Deleted');
            res.redirect('/users/display');
            
        }
    });
});

router.get('/search',function(req,res,next){
    if(req.isAuthenticated())
        res.render('searchEmp',{title:'Search Employee'});
    else{
        res.redirect('/users/login');
    }
});
router.get('/searchE',function(req,res,next){
    // console.log(req.query.search);
    if(req.isAuthenticated()){
        let query;
    if(!req.query.email){
        query = {name:req.query.search};
    }else if(!req.query.search){
        query = {email:req.query.email};
    }else{
        query = {name:req.query.search, email:req.query.email};
    }
    console.log(query);
    Employee.find(query,function(err,emps){
        if(err){
            console.log(err);
        }else{
            res.render('searchEmp',{employe:emps,title:'Search Employee',csrfToken: req.csrfToken()})
            // console.log(emps);
        }
    });
    }else{
        res.redirect('/users/login');
    }
    
});
module.exports = router;