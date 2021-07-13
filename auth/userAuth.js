const jwt = require('jsonwebtoken');
const express = require('express');

module.exports = {
     
    //check  vendor have alreadylogin or not
    ensureUser: function (req, res, next) {
        const token = localStorage.getItem('UserLoginToken');
        if(token==null)return res.redirect('/login');
        jwt.verify(token,"eccddd12c73a5814c0a69bff5645b8ea361781c7019de3b71266336fba7c9be6c68256e0340e17058ea8eaed095c79116b4c16290c3344be3b4937ec763dfaa1", (err, user) => {
            if (err) {
                console.log(err);
                return res.redirect('/login');
            }
            else {
                req.user = user;
                next()
            }
        });
    },
}