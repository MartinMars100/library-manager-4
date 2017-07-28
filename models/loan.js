'use strict';
var dateFormat = require('dateformat');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Loan = sequelize.define('Loan', {
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: {
      type: DataTypes.DATE,
      defaultValue: " "
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
        if (this.Book !== null || this.Book !== undefined) {
          return this.Book.title; 
          
        } else {
            return '';
        }
  };
  Loan.prototype.formatBookId = function() {
        if (this.Book !== null) {
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
  
  return Loan;
};