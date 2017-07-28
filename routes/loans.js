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
            res.render('loans/checked_out', {
              loans: results,
              title: "Checked-Out Books"
            });
          }).catch(function(error) {
            res.send(500, error);
          });
        });


/* Create a new loan form. */
// router.get('/new', function(req, res, next) {
//   res.render("loans/new", {
//     loan: Loan.build(), 
//     title: "New Loan"
//   });
// });

/* POST create loan */
router.post('/', function(req, res, next) {
  Loan.create(req.body).then(function(loan) {
    res.redirect("/loans");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
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
  Book.findAll().then(function(books) {
		Patron.findAll().then(function(patrons) {
			var loanedOn = moment().format('YYYY-MM-DD');
			var returnBy = moment().add('7', 'days').format('YYYY-MM-DD');

			res.render('loans/new', 
			{
				books : books, 
				patrons: patrons, 
				loanedOn: loanedOn,
				returnBy: returnBy,
				title: "New Loan"
			});
  
  
		}).catch(function(error) {
        res.send(500, error);
    });
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
router.get("/:id/delete", function(req, res, next){
  Loan.belongsTo(Book, {foreignKey: 'book_id'});
	Loan.belongsTo(Patron, {foreignKey: 'patron_id'});
  Loan.findOne({ 
    where: {id: req.params.id},
    include: [{model: Book},{model: Patron}] 
  }).then(function(loan){
    if(loan) {
      res.render('loans/delete', {
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

/*  Delete Book Loan - Return Book */
router.delete("/:id", function(req, res, next){
  Loan.findById(req.params.id).then(function(loan){
    if(loan) {
      return loan.destroy();  
    } else {
      res.send(404);
    }
  }).then(function(loan){
    res.redirect("/loans/");     
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

module.exports = router;



