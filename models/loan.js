'use strict';
var dateFormat = require('dateformat');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Loan = sequelize.define('Loan', {
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Book is required"
        }
      }
    }, 
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Patron is required"
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "Enter a Valid Loaned On Date with mm/dd/yyyy format"
        }
      }
    },
    return_by: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "Return Date must come after Loaned On Date with mm/dd/yyyy format"
        }
      }
    },
    returned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "Enter a Valid Returned On Date with mm/dd/yyyy format"
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      formatLoanedOn: function(){
        return dateFormat(this.loaned_on, "mm dd yyyy");
      }
    }
  });
  Loan.prototype.formatLoanedOn = function() {
        if (this.loaned_on > 0) {
          return dateFormat(this.loaned_on, "mm dd yyyy");
        } else {
            return '';
        } 
  };
  Loan.prototype.formatReturnBy = function() {
        if (this.return_by > 0) {
          return dateFormat(this.return_by, "mm dd yyyy");
        } else {
            return '';
        } 
        
  };
  Loan.prototype.formatReturnedOn = function() {
        if (this.returned_on > 0) {
          return dateFormat(this.returned_on, "mm dd yyyy");
        } else {
            return '';
        }
  };
  Loan.prototype.formatPatronFirstName = function() {
        if (this.Patron !== null) {
          return this.Patron.first_name;
        } else {
            return '';
        }
  };
  Loan.prototype.formatPatronLastName = function() {
        if (this.Patron !== null) {
          return this.Patron.last_name ;
        } else {
            return '';
        }
  };
  Loan.prototype.formatBookTitle = function() {
        if (this.Book !== null && this.Book !== undefined) {
          console.log('Loan form book title is looking good');
          return this.Book.title; 
        } else {
          console.log('Loan form book title is null or undefined');
            return '';
        }
  };
  Loan.prototype.formatBookId = function() {
        if (this.Book !== null) {
          console.log('log Loan.formatBookId Book is not null');
          return this.Book.id ;
        } else {
            return '';
        }
  };
  Loan.prototype.formatDate = function(date) {
        return dateFormat(date, "yyyy-mm-dd");
  };
  Loan.prototype.setReturnDate = function(date) {
        return moment().format('YYYY-MM-DD');
  };
  Loan.prototype.validReturnDate = function(date) {
        console.log('log date = ' + date);
        // var regex = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;
        // var regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
        var regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
        if(regex.test(date)){
          console.log('Yes Valid Regex Date');
          return date;
        } else {
          console.log('This is not a valid REGEX Date');
          return '';
        }
  };
  
  return Loan;
};