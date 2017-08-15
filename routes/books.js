var express = require('express'),
    router = express.Router(),
    Book = require("../models").Book,
    Loan = require("../models").Loan,
    Patron = require("../models").Patron,
    moment = require('moment');

/* GET all books */
/* Books wil be listed in desc order by published date */
router.get('/', function(req, res, next) { 
  Book.findAll({order: [["first_published", "DESC"]]}).then(function(books){
    res.render("books", {books: books, title: "Books" });
  }).catch(function(err){
    res.send(500);
  });
});

/* GET all overdue books */
// Get all books where return on date is past today's date
router.get('/overdue', function(req, res, next) { 
          Loan.belongsTo(Book, { foreignKey: 'book_id' });
          Book.hasMany(Loan, { foreignKey: 'book_id' });
          var date = moment(); 
          Book.findAll({
            include: [{
              model: Loan,
              where: {
                return_by: {
                  $lt: moment().format('YYYY-MM-DD')
                },
                returned_on: {
                  $or: ['', null]
                }
              }
            }]
          }).then(function(results) {
            res.render('books/overdue', {
              books: results,
              title: "Overdue Books"
            });
          }).catch(function(error) {
            res.send(500, error);
          });
        });

/* GET all checked out books */
router.get('/checked_out', function(req, res, next) { 
          Loan.belongsTo(Book, { foreignKey: 'book_id' });
          Book.hasMany(Loan, { foreignKey: 'book_id' });
          Loan.belongsTo(Patron, { foreignKey: 'patron_id'});
          Book.findAll({
            include: [{
              model: Loan,
              where: {
                returned_on: {
                  $or: ['', null]
                }
              } //end where
            }] // end include
          }).then(function(results) {
            res.render('books/checked_out', {
              books: results,
              title: "Checked Out Books"
            });
          }).catch(function(error) {
            res.send(500, error);
          });
        });

/* Create a New book form. */
router.get('/new', function(req, res, next) {
  res.render("books/new", {
    book: Book.build(),
    title: "Create New Book"
  });
});

/* Create an Edit book form. */
  router.get("/:id/edit", function(req, res, next){
  Loan.belongsTo(Book, { foreignKey: 'book_id' });
  Book.hasMany(Loan, { foreignKey: 'book_id' });
  Loan.belongsTo(Patron, { foreignKey: "patron_id"});
  Book.findById(req.params.id).then(function(book){   
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
        book_id: book.id
      }
      }).then(function(loans){
          res.render('books/edit', {  
            book: book, 
            loans: loans
          });
      });
      
  }).catch(function(err){
    return next(err);
  });
}); //end router get

/* POST create book. */
router.post('/', function(req, res, next) {
  console.log('log POST create book');
  var validPublished = validYear(req.body.first_published);
  req.body.first_published = validPublished;
  console.log('log valid published = ' + validPublished);
  Book.create(req.body)
  .then(function(book){
    res.redirect("/books/" + book.id + "/edit");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      console.log('log New Book SQL Error');
      res.render("books/new", {
        book: Book.build(req.body), 
        title: "New Book",
        errors: err.errors
      });
    } 
  }).catch(function(err){
    res.send(500);
  });
});
  
/* PUT update book. */
router.put('/:id', function(req, res, next){
 Book.findById(req.params.id).then(function(book) {  
    if(book) { 
      return book.update(req.body);
    } else {
        res.sendStatus(404);
    }
  
  }).then(function(book) {
    res.redirect("/books");
      
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      book.id = req.params.id;
      res.render("books/edit", {
        book: Book.build(req.body),
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    return next(err);
  });
});

/* DELETE individual book. */
router.delete("/:id", function(req, res, next){
  Book.findById(req.params.id).then(function(book){
    if (book){
      return book.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect("/books");  
  }).catch(function(err){
    res.send(500);
  });
});

// The validYear function is used by the new book page and edit book page to check date formats
validYear = function(date) {
  console.log('date = ' + date);
  var regex = /(19\d{2})|(200\d)|(201[0-3])/;
        
  if(regex.test(date)){
    console.log('Yes Valid Date');
    return date;
  } else {
    console.log('This is not a VValid Date');
    return '';
  }
};

module.exports = router;