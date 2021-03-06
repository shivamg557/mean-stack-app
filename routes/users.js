const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const menuItem = require('../models/menuItem');
const { isValidObjectId } = require('mongoose');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to register user' });
    } else {
      res.json({ success: true, msg: 'User registered' });
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  //const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'email not found' });
    }
    

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ data: user }, config.secret, {
          expiresIn: 604800 // 1 week
        });
      
        res.json({
          success: true,
          token: `Bearer ${token}`,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({ success: false, msg: 'Wrong password' });
      }
    });
  });
});
// Profile
router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
    menuItem.find((err,docs) =>{
    if(!err){res.send(docs);}
    else{console.log("error in retrieving");}
  });
});
  //add menu-items
router.post('/additem', (req, res) => {
  var item= new menuItem({
    name: req.body.name,
    price: req.body.price,
    priceTag:req.body.priceTag,
    category: req.body.category
  });
  item.save((err,doc)=>{
    if(!err){res.send(doc);}
    else{console.log("error in save");}
  });
});

router.get('/:id',(req,res)=>{
  if(!isValidObjectId(req.params.id))
    return res.status(400).send('No record with given id');

  menuItem.findById(req.params.id,(err,docs)=>{
    if(!err){
      res.send(docs);
    }
    else{console.log('error in retrieving item')}
  });
});

//UPDATE OPERATION
router.put('/:id',(req, res) => {
  var Item ={
      name: req.body.name,
      price: req.body.price,
      priceTag:req.body.priceTag,
      category: req.body.category,
    }
  menuItem.findByIdAndUpdate(req.params.id,{$set:Item},{new:true},(err,doc) =>{
    if(!err) res.send(doc);
    else{
      console.log("error in update")
    }
    });

  });

router.delete('/:id',(req, res) => {
  menuItem.findByIdAndRemove(req.params.id,(err,doc) =>{
    if(!err) res.send(doc);
    else{
      console.log("error in remove")
    }
    });
});

module.exports = router;