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
        notEmpty: {
          msg: "Email is required"
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Library Id is required"
        }
      }
    },  
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Zip Code is required"
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
          console.log('log Patron first name = ' + Patron.first_name);
          return Patron.first_name;
        } else {
            console.log('Patron.first_name is blank');
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