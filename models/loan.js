'use strict';
var dateFormat = require('dateformat');

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
        return dateFormat(this.loaned_on, "mm dd yyyy");
  };
  Loan.prototype.formatReturnBy = function() {
        return dateFormat(this.return_by, "mm dd yyyy");
  };
  Loan.prototype.formatReturnedOn = function() {
        return dateFormat(this.returned_on, "mm dd yyyy");
  };
  return Loan;
};