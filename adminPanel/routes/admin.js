let express = require('express');
let router = express.Router();
let csrf = require('csurf');
const validation = require('express-validator');

let csrfProtection = csrf();

router.use(csrfProtection);

//Model

let Employee = require('../models/employee');

router.get('/dashboard',function(req,res,next){
    res.render('dashboard');
});

module.exports = router;