var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey');
const userModel = require('../models/user');


var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET login page. */
router.get('/', async function(req, res, next) {
  if(req.session.user){
    req.session.user = null;
  }
  res.render('login');
});


/* GET homepage. */
router.get('/homepage', async function(req, res, next) {
  if(!req.session.user){
    return res.redirect("/");
  }
  if(req.session.basket == null){
    req.session.basket = [];
  }
  res.render('homepage');
});


/* List up founded journey */
router.post('/findjourney', async function (req, res, next){
  if(!req.session.user){
    return res.redirect("/");
  }
  if(req.session.basket == null){
    req.session.basket = [];
  }
  let tempName1 = req.body.departure.toLowerCase()
  let newDepatureName = tempName1.charAt(0).toUpperCase() + tempName1.slice(1)
  let tempName2 = req.body.arrival.toLowerCase()
  let newArrivalName = tempName2.charAt(0).toUpperCase() + tempName2.slice(1)

  let journeyList = await journeyModel.find({ departure : newDepatureName, arrival: newArrivalName, date: req.body.date});
  if(journeyList.length == 0){
    res.render('oops')
  } else {
    res.render('results', {journeyList})
  }
    }
  
)

/* Add founded journey to basket */

router.get('/add_basket', async function (req, res, next){
  if(!req.session.user){
    return res.redirect("/");
  }
    if(req.session.basket == null){
      req.session.basket = [];
    }
    let slctJourney = await journeyModel.findOne({ _id : req.query.slctJourney});

    req.session.basket.push(slctJourney)
    res.redirect('/basket');
});

router.get('/basket', async function (req,res){
  if(!req.session.user){
    return res.redirect("/");
  }
  if(req.session.basket == null){
    req.session.basket = [];
  }
  res.render('basket',{basketList: req.session.basket})
})

router.get('/mytrips', async function(req,res){
  if(!req.session.user){
    console.log("no user identified");
    return res.redirect("/");
  }else{
    if(req.session.basket == null){
      req.session.basket = [];
    }
    let currentUser = await userModel.findOne({_id: req.session.user.id});
    let myTrips = [];
    for(var i = 0; i < currentUser.journeys.length; i++){
      myTrips.push(await journeyModel.findOne({_id: currentUser.journeys[i] }));
    }
    console.log(myTrips);
    res.render('myLastTrips', {myTrips});
  }
})

/* Add confirmed journey to my Last Trips */
router.get('/confirm-basket', async function(req,res){
  if(!req.session.user){
    return res.redirect("/");
  }
  for(var i = 0; i < req.session.basket.length; i++){
    await userModel.updateOne({_id: req.session.user.id}, {$push: {journeys: req.session.basket[i]._id}});
  }
  req.session.basket = null;
  res.redirect('/mytrips');
})



// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       await newUser.save();
    }
  }
  res.render('/', { title: 'Express' });
});

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
      function (err, journey) {
          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )
  }
  res.render('/', { title: 'Express' });
});



module.exports = router;
