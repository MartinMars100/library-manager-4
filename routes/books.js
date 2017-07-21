var express = require('express'),
    router = express.Router(),
    Book = require("../models").Book,
    Loan = require("../models").Loan,
    Patron = require("../models").Patron,
    moment = require('moment');

/* GET all books */
router.get('/', function(req, res, next) {
  console.log('log router GET all books');
  Book.findAll({order: [["first_published", "DESC"]]}).then(function(books){
    res.render("books", {books: books, title: "Books" });
  }).catch(function(err){
    res.send(500);
  });
});

/* GET all overdue books */
router.get('/overdue', function(req, res, next) { 
          Loan.belongsTo(Book, { foreignKey: 'book_id' });
          Book.hasMany(Loan, { foreignKey: 'book_id' });
          console.log('log get all overdue books');
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
          console.log('log get all checked out books');
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
  console.log('log create a new book form');
  res.render("books/new", {
    book: Book.build(),
    title: "Create New Book"
  });
});

/* Create an Edit book form. */
router.get("/:id/edit", function(req, res, next){
  Book.findById(req.params.id).then(function(book){
    if (book) {
      res.render("books/edit", {
        book: book,
        title: "Edit Book"
      });
    } else {
      res.send(404);
    }
    }).catch(function(err){
    res.send(500);
  });
});

/* POST create book. */
router.post('/', function(req, res, next) {
  console.log('log router post book');
  Book.create(req.body).then(function(book) {
    res.redirect("/books/" + book.id);
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      console.log('log error');
      res.render("books/new", {
        article: Book.build(req.body), 
        title: "New Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.send(500);
  });
});

/* Delete book form. */
// router.get("/:id/delete", function(req, res, next){
//   Book.findById(req.params.id).then(function(book){  
//     if(book) {
//       res.render("books/delete", {book: book, title: "Delete Book"});
//     } else {
//       res.send(404);
//     }
//   }).catch(function(err){
//     res.send(500);
//   });
// });

/* GET book details by ID */
router.get("/:id", function(req, res, next){
  console.log("log router get ind book");
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
          res.render('books/detail', {  
            book: book, 
            loans: loans
          });
      });
      
  }).catch(function(err){
    return next(err);
  });
}); //end router get
  
/* PUT update book. */
router.put('/:id', function(req, res, next){
 Book.findById(req.params.id).then(function(book) {  
    if(book) { 
      console.log('book in update found');
      return book.update(req.body);
    } else {
        res.sendStatus(404);
    }
  
  }).then(function(book) {
    res.redirect("/books/" + book.id);
      
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      var book = Book.build(req.body);
      book.id = req.params.id;
      res.render("books/detail", {
        book: book,
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

module.exports = router;