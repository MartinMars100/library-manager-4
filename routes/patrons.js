var express = require('express'),
    router = express.Router(),
    Book = require("../models").Book,
    Loan = require("../models").Loan,
    Patron = require("../models").Patron;

/* GET patrons listing. */
router.get('/', function(req, res, next) {
  Patron.findAll({order: [["createdAt", "DESC"]]}).then(function(patrons){
    res.render("patrons", {
      patrons: patrons, 
      title: "Patrons" 
    });
  }).catch(function(err){
    res.spend(500);
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
    res.spend(500);
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
  Patron.findById(req.params.id).then(function(patron){
    if (patron) {
      res.render("patrons/edit", {
        patron: patron
      });
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
      res.render("patrons/delete", {
        patron: patron, 
        title: "Delete Patron"
      });
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.spend(500);
  });
});

/* Create an Edit patron form */
// router.get("/:id/edit", function(req, res, next){
//   Loan.belongsTo(Book, { foreignKey: 'book_id' });
//   Book.hasMany(Loan, { foreignKey: 'book_id' });
//   Loan.belongsTo(Patron, { foreignKey: "patron_id"});
//   Patron.findById(req.params.id).then(function(patron){
//   Loan.findAll({
//     include: [
//       { 
//         model: Book    
//       },
//       {
//         model: Patron
//       }
//       ],
//       where: {                
//         patron_id: patron.id
//       }
//       }).then(function(loans){
//         if (patron){
//           res.render("patrons/detail", {
//             patron: patron,
//             loans: loans
//           });   
//         } else {
//           res.send(404);
//         }
//       });
//   }).catch(function(err){
//     return next(err);
//   });
// });

/* PUT update patron. */
router.put("/:id", function(req, res, next){
  Patron.findById(req.params.id).then(function(patron){
    if(patron) {
      return patron.update(req.body);  
    } else {
      res.send(404);
    }
  }).then(function(patron){
    res.redirect("/patrons/" + patron.id + "/edit");     
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