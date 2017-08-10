'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patron = sequelize.define('Patron', {
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "First Name is required"
        }
      }
    },
    last_name: { 
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Last Name is required"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Address is required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Enter a correct email address"
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        isInt: {
          msg: "Library Id should be all numbers"
        }
      }
    },  
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Zip Code should be all numbers"
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  Patron.prototype.formatPatronFirstName = function() {
        if (Patron !== null) {
          return Patron.first_name;
        } else {
            return '';
        }
  };
  Patron.prototype.formatPatronLastName = function() {
        if (Patron !== null) {
          return Patron.last_name ;
        } else {
            return '';
        }
  };
  return Patron;
};