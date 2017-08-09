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
          console.log('log get all checked out book loans');
          Loan.findAll({
            where: {
              returned_on: {
                  $or: ['', null]
              }
            },
            include: [
              {
                model: Book
              },
              {
                model: Patron
              }
              ]
          }).then(function(results) {
              res.render('loans/checked_out', {
              loans: results,
              title: "Checked-Out Book Loans"
            });
          }).catch(function(error) {
            res.send(500, error);
          });
        });

/* Create a new loan form. */
router.get('/new', function(req, res, next) {
  console.log('log create a new loan form');
  Book.findAll().then(function(books) {
		Patron.findAll().then(function(patrons) {
			var loanedOn = moment().format('MM/DD/YYYY');
			var returnBy = moment().add('7', 'days').format('MM/DD/YYYY');
			res.render('loans/new', 
			{
				books : books, 
				patrons: patrons, 
				loanedOn: loanedOn,
				returnBy: returnBy,
				title: "New Loan"
			});
  
		}).catch(function(error) {
		    console.log('log create new loan form catch error');
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
router.get("/:id/return", function(req, res, next){
  Loan.belongsTo(Book, {foreignKey: 'book_id'});
	Loan.belongsTo(Patron, {foreignKey: 'patron_id'});
	var returnedOn = moment().format('MM/DD/YYYY');
  Loan.findOne({ 
    where: {id: req.params.id},
    include: [{model: Book},{model: Patron}] 
  }).then(function(loan){
    if(loan) {
      res.render('loans/return', {
        loan: loan,
        title: "Return Book",
        returnedOn: returnedOn
      });
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
  });
});

/* POST create loan */
router.post('/', function(req, res, next) {
  console.log('log req.body.loaned_on = ' + req.body.loaned_on)
  var validLoanedOn = validDate(req.body.loaned_on);
  req.body.loaned_on = validLoanedOn;
  var validReturnBy = validDate(req.body.return_by);
  req.body.return_by = validReturnBy;
  
  req.body.return_by = validReturn(req.body.loaned_on, req.body.return_by)
  
  Loan.create(req.body)
  .then(function(loan) {
    res.redirect("/loans");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      console.log('log Sql Error on  create a new loan form');
      Book.findAll().then(function(books) {
		    Patron.findAll().then(function(patrons) {
			    var loanedOn = moment().format('MM/DD/YYYY');
			    var returnBy = moment().add('7', 'days').format('MM/DD/YYYY');
			    res.render('loans/new', 
			    {
				    books : books, 
				    patrons: patrons, 
				    loanedOn: loanedOn,
				    returnBy: returnBy,
				    title: "New Loan",
				    errors: err.errors
			    });  
		    });
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    console.log('log New Loan Catch Error');
    res.send(500);
  });
}); 

/*  Return Book */
router.put("/:id", function(req, res, next){
  console.log('log return book returned_on = ' + req.body.returned_on);
  Loan.belongsTo(Book, {foreignKey: 'book_id'});
	Loan.belongsTo(Patron, {foreignKey: 'patron_id'});
// 	var returnedOn = moment().format('YYYY-MM-DD');
  console.log('log Return Book');
  Loan.findById(req.params.id).then(function(loan){
    if(loan) {
      console.log('log req.body.returned_on = ' + req.body.returned_on);
      var validDate = loan.validReturnDate(req.body.returned_on);
      console.log('log validDate = ' + validDate)
      return loan.update({returned_on: validDate});
    } else {
      console.log('Return Book loan not found');
      res.sendStatus(404);
    }
  })
  .then(function(loan){
    res.redirect("/loans/");     
  })
  .catch(function(err){
      if(err.name === "SequelizeValidationError"){
        console.log('book return sql valiate error');
      
        Loan.findOne({ 
          where: {id: req.params.id},
          include: [{model: Book},{model: Patron}] 
        })
        .then(function(loan){
          res.render("loans/return", {
          loan: loan, 
          title: "Return Book",
          errors: err.errors
          })
        });
      }
  })
  .catch(function(err){
    res.send(500);
  });
});

validDate = function(date) {
var regex = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;
        
if(regex.test(date)){
  console.log('Yes Valid Date');
  return date;
} else {
  console.log('This is not a Valid Date');
  return '';
  }
};

validReturn = function(loanedOn,returnBy) {

if (returnBy > loanedOn) {
  console.log('returnBy is > loanedOn Date');
  return returnBy;
} else {
  console.log('Return By Date must come after loaned On date');
  return '';
  }
};

module.exports = router;



