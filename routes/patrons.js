var express = require('express');
var router = express.Router();
var Patron = require("../models").Patron;


/* GET patrons listing. */
router.get('/', function(req, res, next) {
  console.log('log route get all patrons');
  Patron.findAll({order: [["createdAt", "DESC"]]}).then(function(patrons){
    res.render("patrons", {patrons: patrons, title: "Patrons" });
  }).catch(function(err){
    res.spend(500);
  });
});

/* POST create patron. */
router.post('/', function(req, res, next) {
  Patron.create(req.body).then(function(patron) {
    console.log('creating a new patron');
    res.redirect("/patrons");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      console.log('error creating a new patron');
      res.render("patrons/new", {
        patron: Patron.build(req.body), 
        title: "New Patron",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.spend(500);
  });
});

/* Create a new patron form. */
router.get('/new', function(req, res, next) {
  console.log('log create a new patron form');
  res.render("patrons/new", {patron: Patron.build(), title: "New Patron"});
});

/* Edit patron form. */
router.get("/:id/edit", function(req, res, next){
  Patron.findById(req.params.id).then(function(patron){
    if (patron) {
      res.render("patrons/edit", {patron: patron, title: "Edit Patron"});
    } else {
      res.send(404);
    }
    }).catch(function(err){
    res.spend(500);
  });
});


/* Delete patron form. */
router.get("/:id/delete", function(req, res, next){
  Patron.findById(req.params.id).then(function(patron){  
    if(patron) {
      res.render("patrons/delete", {patron: patron, title: "Delete Patron"});
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.spend(500);
  });
});

/* GET individual patron. */
router.get("/:id", function(req, res, next){
  Patron.findById(req.params.id).then(function(patron){
    if (patron){
      res.render("patrons/show", {patron: patron, title: patron.title});   
    } else {
      res.send(404);
    }
  
  }).catch(function(err){
    res.spend(500);
  });
});

/* PUT update patron. */
router.put("/:id", function(req, res, next){
  Patron.findById(req.params.id).then(function(patron){
    if(patron) {
      return patron.update(req.body);  
    } else {
      res.send(404);
    }
  }).then(function(patron){
    res.redirect("/patrons/" + patron.id);     
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      var patron = Patron.build(req.body);
      patron.id = req.params.id;
      
      res.render("patrons/edit", {
        patron: patron, 
        title: "Edit Patron",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.spend(500);
  });
});

/* DELETE individual patron. */
router.delete("/:id", function(req, res, next){
  Patron.findById(req.params.id).then(function(patron){
    if (patron){
      return patron.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect("/patrons");  
  }).catch(function(err){
    res.spend(500);
  });
});


module.exports = router;