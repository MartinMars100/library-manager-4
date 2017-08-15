'use strict';
var dateFormat = require('dateformat');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Title is required"
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Author is required"
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Genre is required"
        }
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Enter a Valid First Published year with yyyy format"
        }
      }
    }
  }, {
      classMethods: {
        associate: function(models) {
        // associations can be defined here
      }
    },
  });
  Book.prototype.formatBookTitle = function() {
        if (this.title > 0) {
          return this.title;
        } else {
            return '';
        } 
  };
  Book.prototype.formatPublishedDate = function() {
        if (this.first_published > 0) {
          return dateFormat(this.loaned_on, "yyyy");
        } else {
            return '';
        } 
  };
  Book.prototype.validReturnDate = function(date) {
        var regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
        if(regex.test(date)){
          return date;
        } else {
          return '';
        }
  };
  
  return Book;
};