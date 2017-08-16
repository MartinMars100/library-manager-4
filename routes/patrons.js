var express = require('express'),
    router = express.Router(),
    Book = require("../models").Book,
    Loan = require("../models").Loan,
    Patron = require("../models").Patron;

/* GET patrons listing. */
// Patrons Will be listed in desc order by date they were created
router.get('/', function(req, res, next) {
  Patron.findAll({order: [["createdAt", "DESC"]]}).then(function(patrons){
    res.render("patrons", {
      patrons: patrons, 
      title: "Patrons" 
    });
  }).catch(function(err){
    res.send(500);
  });
});

/* Create a new patron form. */
router.get('/new', function(req, res, next) {
  res.render("patrons/new", {
    patron: Patron.build(),
    title: "New Patron"
  });
});

/* Create an Edit patron form. */
router.get("/:id/edit", function(req, res, next){
  Loan.belongsTo(Patron, { foreignKey: 'patron_id'});
  Loan.belongsTo(Book, { foreignKey: 'book_id' });
  Patron.findOne({
    where: {id: req.params.id}
  })
  .then(function(patron){
    Loan.findAll({
      include: [
        {
          model: Book
        }
        ],
        where: {
          patron_id: patron.id
        } 
    })
    .then(function(loans){
      res.render('patrons/edit', {
        patron: patron,
        loans: loans
      });
    });
  })
  .catch(function(err){
    return next(err);
  });
});


/* Delete patron form. */
router.get("/:id/return", function(req, res, next){
  Patron.findById(req.params.id).then(function(patron){  
    if(patron) {
      res.render("patrons/return", {
        patron: patron, 
        title: "Delete Patron"
      });
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
  });
});

/* POST create patron. */
router.post('/', function(req, res, next) {
  Patron.create(req.body).then(function(patron) {
    res.redirect("/patrons/" + patron.id + "/edit");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      res.render("patrons/new", {
        patron: Patron.build(req.body), 
        title: "New Patron",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.send(500);
  });
});

/* PUT update patron. */
router.put("/:id", function(req, res, next){
  Loan.belongsTo(Patron, { foreignKey: 'patron_id'});
  Loan.belongsTo(Book, { foreignKey: 'book_id' });
  console.log('log update patron');
  Patron.findOne({
    where: {id: req.params.id}
  }).then(function(patron){
    if(patron) {
      console.log('log update patron found');
      return patron.update(req.body);  
    } else {
      res.send(404);
    }
  }).then(function(patron){
    console.log('log update patron about to redirect');
    res.redirect("/patrons/" + patron.id + "/edit");     
  }).catch(function(err){
    console.log('log update patron catch found');
    if(err.name === "SequelizeValidationError"){
      console.log('update patron SQL ERROR');
      Loan.belongsTo(Patron, { foreignKey: 'patron_id'});
      Loan.belongsTo(Book, { foreignKey: 'book_id' });
      Patron.findOne({
        where: {id: req.params.id}
      })
      .then(function(patron){
        patron.first_name = req.body.first_name;
        patron.last_name = req.body.last_name;
        patron.address = req.body.address;
        patron.email = req.body.email;
        patron.library_id = req.body.library_id;
        patron.zip_code = req.body.zip_code;
      Loan.findAll({
        include: [
        {
          model: Book
        }
        ],
        where: {
          patron_id: patron.id
        } 
    })
    .then(function(loans){
      res.render('patrons/edit', {
        patron: patron,
        loans: loans,
        errors: err.errors
      });
    });
  });  
  }
  }).catch(function(err){
    return next(err);
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
    res.send(500);
  });
});

module.exports = router;