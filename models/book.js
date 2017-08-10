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
      type: DataTypes.INTEGER
    }
  }, {
      classMethods: {
        associate: function(models) {
        // associations can be defined here
      }
    },
  });
  Book.prototype.formatPublishedDate = function() {
        if (this.first_published > 0) {
          console.log('formatPublishedDate looks good');
          console.log(this.first_published);
          return dateFormat(this.loaned_on, "yyyy");
        } else {
            console.log('formatPublishedDate looks bad');
            console.log(this.first_published);
            return '';
        } 
  };

  return Book;
};