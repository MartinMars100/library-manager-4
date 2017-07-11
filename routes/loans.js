var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;


/* GET all loans */
router.get('/', function(req, res, next) {
  Loan.findAll({order: [["createdAt", "DESC"]]}).then(function(loans){
    res.render("loans", {loans: loans, title: "Loans" });
  }).catch(function(err){
    res.spend(500);
  });
});

/* Create a new loan form. */
router.get('/new', function(req, res, next) {
  console.log('log create a new loan form');
  res.render("loans/new", {loan: Loan.build(), title: "New Loan"});
});


/* POST create loan */
router.post('/new', function(req, res, next) {
  console.log('log router post loan');
  Loan.create(req.body).then(function(loan) {
    console.log('log successfull POST create loans');
    res.redirect("/loans");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      console.log('log error');
      res.render("books/new", {
        loan: Loan.build(req.body), 
        title: "New Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.spend(500);
  });
});

/* Create a new loan form. */
router.get('/new', function(req, res, next) {
  res.render("loans/new", {loan: Loan.build(), title: "New Loan"});
});

/* Edit loan form. */
router.get("/:id/edit", function(req, res, next){
  Loan.findById(req.params.id).then(function(loan){
    if (loan) {
      res.render("loans/edit", {loan: loan, title: "Edit Loan"});
    } else {
      res.send(404);
    }
    }).catch(function(err){
    res.spend(500);
  });
});

/* Delete loan form. */
router.get("/:id/delete", function(req, res, next){
  Loan.findById(req.params.id).then(function(loan){  
    if(loan) {
      res.render("loans/delete", {loan: loan, title: "Delete Loan"});
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.spend(500);
  });
});

/* GET individual loan */
router.get("/:id", function(req, res, next){
  Loan.findById(req.params.id).then(function(loan){
    if (loan){
      res.render("loans/show", {loan: loan, title: loan.book_id});   
    } else {
      res.send(404);
    }
  
  }).catch(function(err){
    res.spend(500);
  });
});

/* PUT update loan. */
router.put("/:id", function(req, res, next){
  Loan.findById(req.params.id).then(function(loan){
    if(loan) {
      return loan.update(req.body);  
    } else {
      res.send(404);
    }
  }).then(function(loan){
    res.redirect("/loans/" + loan.id);     
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      var loan = Loan.build(req.body);
      loan.id = req.params.id;
      
      res.render("loans/edit", {
        loan: loan, 
        title: "Edit Loan",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.spend(500);
  });
});

/* DELETE individual loan. */
router.delete("/:id", function(req, res, next){
  Loan.findById(req.params.id).then(function(loan){
    if (loan){
      return loan.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect("/loans");  
  }).catch(function(err){
    res.spend(500);
  });
});


module.exports = router;