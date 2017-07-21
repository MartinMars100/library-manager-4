var express = require('express'),
    router = express.Router(),
    Book = require("../models").Book,
    Loan = require("../models").Loan,
    Patron = require("../models").Patron,
    moment = require('moment');


/* GET all loans */
router.get('/', function(req, res, next) {
  Loan.belongsTo(Book, { foreignKey: 'book_id' });
  Book.hasMany(Loan, { foreignKey: 'book_id' });
  Loan.belongsTo(Patron, { foreignKey: 'patron_id'});
  console.log('log get all loans');
  var date = moment(); 
  Loan.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Book
      },
      {
        model: Patron
      }
      ]
  }).then(function(results){
    res.render("loans", {
      loans: results,
      title: "Loans"
    });
  }).catch(function(err){
    // res.send(500);
    return next(err); 
  });
});

/* GET all overdue loans */
router.get('/overdue', function(req, res, next) { 
          Loan.belongsTo(Book, { foreignKey: 'book_id' });
          Book.hasMany(Loan, { foreignKey: 'book_id' });
          Loan.belongsTo(Patron, { foreignKey: 'patron_id'});
          console.log('log get all overdue loans');
          var date = moment(); 
          Loan.findAll({
            include: [
              {
                model: Book
              },
              {
                model: Patron
              }
              ],
              where: {
                return_by: {
                  $lt: moment().format('YYYY-MM-DD')
                },
                returned_on: {
                  $or: ['', null]
                }
              }
          }).then(function(results) {
            console.log('log found overdue books' + results);
            res.render('loans/overdue', {
              loans: results,
              title: "Overdue Loans"
            });
          }).catch(function(error) {
            res.send(500, error);
          });
        });

/* GET all checked out loans */
router.get('/checked_out', function(req, res, next) { 
          Loan.belongsTo(Book, { foreignKey: 'book_id' });
          Book.hasMany(Loan, { foreignKey: 'book_id' });
          Loan.belongsTo(Patron, { foreignKey: 'patron_id'});
          console.log('log get all overdue loans');
          var date = moment(); 
          Loan.findAll({
            include: [
              {
                model: Book
              },
              {
                model: Patron
              }
              ],
              where: {
                returned_on: {
                  $eq: ['', null]
                }
              }
          }).then(function(results) {
            console.log('log found checked out books' + results);
            res.render('loans/checked_out', {
              loans: results,
              title: "Checked-Out Books"
            });
          }).catch(function(error) {
            res.send(500, error);
          });
        });


/* Create a new loan form. */
router.get('/new', function(req, res, next) {
  console.log('log create a new loan form');
  res.render("loans/new", {
    loan: Loan.build(), 
    title: "New Loan"
  });
});


/* POST create loan */
router.post('/', function(req, res, next) {
  console.log('log router post loan');
  Loan.create(req.body).then(function(loan) {
    console.log('log successfull POST create loans');
    res.redirect("/loans");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      console.log('log error');
      res.render("loans/new", {
        loan: Loan.build(req.body), 
        title: "New Loan",
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
  res.render("loans/new", {
    loan: Loan.build(),
    title: "New Loan"
  });
});

/* Edit loan form. */
router.get("/:id/edit", function(req, res, next){
  Loan.findById(req.params.id).then(function(loan){
    if (loan) {
      res.render("loans/edit", {
        loan: loan, 
        title: "Edit Loan"
      });
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
      res.render("loans/delete", {
        loan: loan, 
        title: "Delete Loan"
      });
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
      res.render("loans/show", {
        loan: loan, 
        title: loan.book_id
      });   
    } else {
      res.send(404);
    }
  
  }).catch(function(err){
    res.spend(500);
  });
});

/* Create a Return Book loan form. */
router.get("/return/:id", function(req, res, next){
  console.log('log router create return form');
  Loan.belongsTo(Book, {foreignKey: 'book_id'});
	Loan.belongsTo(Patron, {foreignKey: 'patron_id'});
  
  Loan.findOne({ 
    where: {id: req.params.id},
    include: [{model: Book},{model: Patron}] 
  }).then(function(loan){
    console.log('log router found id of return book');
    if(loan) {
      res.render('loans/return', {
        loan: loan,
        title: "Return Book"
      });
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
  });
});

/* PUT return book update loan. */
router.post("/", function(req, res, next){
  console.log('log router put update loan');
  Loan.findById(req.params.id).then(function(loan){
    if(loan) {
      console.log('loan found in router put');
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


//PUT /loans/:id - Return Book with Update to loan 
// router.put('/:id', function(req, res, next) {
// 	Loans.findById(req.params.id).then(function(loan) {
// 		return loan.update(req.body);
// 	}).then(function() {
// 		res.redirect('/loans');
// 	}).catch(function(err) {
//     	res.sendStatus(500);
//   	});
// });

/* DELETE individual loan. */
// router.delete("/:id", function(req, res, next){
//   Loan.findById(req.params.id).then(function(loan){
//     if (loan){
//       return loan.destroy();
//     } else {
//       res.send(404);
//     }
//   }).then(function(){
//     res.redirect("/loans");  
//   }).catch(function(err){
//     res.spend(500);
//   });
// });


module.exports = router;



