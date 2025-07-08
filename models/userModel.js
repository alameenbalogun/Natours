const mongoose = require('mongoose');
const validator = require('validator');
const { default: isEmail } = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    min: [8, 'Password should be more than 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confrim your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password must be the same with the password confirm',
    },
  },
});






const User = mongoose.model('User', userSchema);

module.exports = User;
