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
      type: DataTypes.STRING
      // validate: {
      //   formatDate() {
      //   console.log('log New Book first published date');
      //   var regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
      //   if(regex.test(this)){
      //     console.log('Yes Valid Regex Date');
      //     return this;
      //   } else {
      //       console.log('This is not a valid REGEX Date');
      //     return '';
      //   }
      // }
      // }
    }
  }, {
      classMethods: {
        associate: function(models) {
        // associations can be defined here
      }
    }
  }
  );
  
  return Book;
};