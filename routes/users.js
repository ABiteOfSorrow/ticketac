var express = require('express');
var router = express.Router();
var userModel = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* Sign_up. */
router.post('/sign_up', async function (req, res, next) {
  req.session.userName = req.body.userName,
  req.session.userFirstName = req.body.userFirstName,
  req.session.userEmail = req.body.userEmail,
  req.session.userPassword = req.body.userPassword

  let alreadyExist = await userModel.findOne({ email : req.session.userEmail });

  if(alreadyExist == null){
    let newUser = new userModel({
      name: req.body.userName,
      firstName: req.body.userFirstName,
      email: req.body.userEmail,
      password: req.body.userPassword
    })
    let userSaved = await newUser.save()
      if (userSaved) {
        console.log('userData input to BD Success!')
      }
      if (userSaved) {
        req.session.user = {
          id: userSaved.id,
          email: userSaved.email
        }
      }
  }
  res.redirect('/homepage');
});



/* Sign_in */
router.post('/sign_in', async function (req, res, next){
    let alreadyExist = await userModel.find({ email : req.body.userEmail, password: req.body.userPassword});
      if(alreadyExist.length > 0){
        req.session.user = {
          id: alreadyExist[0]._id,
          email: alreadyExist[0].email
        }
        req.session.basket = [];
        res.redirect('/homepage')
      } else{
          res.redirect('/')
      }
    }
);

/* Sign_out */
router.get('/logout', async function(req, res, next){
  req.session.user = null;
  res.redirect('/')
})


module.exports = router;
