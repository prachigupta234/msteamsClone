const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;
var err = '';
const {ensureUser} = require('../auth/userAuth');
router.get('/',(req,res)=>{
    res.redirect('/login');
})
router.get('/signup', (req, res) => {
    res.render('signup', { err });
})
    .post('/signup', (req, res) => {
        const { password, name } = req.body;
        const number = req.body.phone;
        bcrypt.hash(password, saltRounds, function (err, hash) {
            // Store hash in your password DB.
            User.findOne({ phoneNumber: Number(number) }, async (err, user) => {
                if (!err) {
                    if (!user) {
                        const newUser = await new User(
                            {
                                _id: new mongoose.Types.ObjectId(),
                                phoneNumber: Number(number),
                                name: name,
                                password: hash
                            }).save();
                        //authenticate  and set access token
                        const accessToken = await jwt.sign({ phoneNumber: Number(number), password }, "eccddd12c73a5814c0a69bff5645b8ea361781c7019de3b71266336fba7c9be6c68256e0340e17058ea8eaed095c79116b4c16290c3344be3b4937ec763dfaa1");
                        localStorage.setItem('UserLoginToken', accessToken);
                        res.redirect('/login');
                    }
                    else {
                        console.log("User already exist!!");
                        err = 'Phone Number already registered!!';
                        res.render('signup', { err });
                        err = '';
                    }
                }
                else {
                    console.log(err);
                }
            });
            if (err) {
                console.log(err);
            }
        });
    });

router.get('/login', (req, res) => {
    res.render('loginform', { err });
})
    .post('/login', async (req, res) => {
        const password = req.body.password;
        const number = req.body.phone;
        User.findOne({ phoneNumber: Number(number) }, (err, user) => {
            if (!err) {
                if (!user) {
                    err = `This ${number} is not registered, please first register then Login.`;
                    res.render('loginform', { err });
                    err = '';
                } else {
                    bcrypt.compare(password, user.password, async (err, result) => {
                        if (err) {
                            console.log(err);
                            err = 'Something went wrong, Please try again.';
                            res.render('loginform', { err });
                            err = '';
                        } else {
                            if (result === true) {
                                //authenticate  and set access token
                                const accessToken = await jwt.sign({ phoneNumber: Number(number), password }, process.env.JWT_ACCESS_KEY);
                                localStorage.setItem('UserLoginToken', accessToken);
                                // var _id = user._id;
                                // const Token = await jwt.sign({ _id, password }, "process.env.JWT_ACCESS_KEY");
                                localStorage.setItem('UserID',user._id);
                                var proi = user._id;
                                res.redirect(`main/${proi}`);

                            } else {
                                err = 'Please enter correct password';
                                res.render('loginform', { err });
                                err = '';
                            }
                        }
                    });
                }
            } else {
                console.log(err);
                err = 'Something went wrong, Please try again.';
                res.render('loginform', { err });
                err = '';
            }
        });
    });

//logout route
router.get('/logout',ensureUser, (req, res) => {
    localStorage.removeItem('UserLoginToken');
    localStorage.removeItem('UserID');
    res.redirect('/login');
});
router.get("/call", (req, res) => {
    res.redirect(`/call/${uuidv4()}`);
});
router.get("/main/:proi",ensureUser, (req, res) => {
    const id = localStorage.getItem('UserID');
    items=[];
    User.find({_id: { $ne: id }}, (err, all) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('main', { all:all, id:id, err });
        }
    });
});

router.get("/call/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});
router.get("/chat/:po",ensureUser, async (req, res) => {
    const proi = localStorage.getItem('UserID');
    // await User.findOne({_id:proi},(err,user)=>{
    //     if (err) {
    //         console.log(err);
    //         res.status(500).send('An error occurred', err);
    //     }
    //     else {
    //         var userName = user.name;
    //         var chatID = req.params.po + userName;
    //         var sort = function(text){return text.split('').sort().join('');};
    //         var chatId = sort(chatID);
    //         res.render("chat", { chatId: chatId, name:req.params.po, err });
    //     }
    // });
    res.render("chat", { chatId: "chatId", name:req.params.po, err });
});
module.exports = router;