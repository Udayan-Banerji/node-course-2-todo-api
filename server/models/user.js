const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new Schema({
  email: {
  type: String,
  required: true,
  validate: {
          // validator: function(v) {
          //   return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
          validator: (value) => {
            return validator.isEmail(value);
          },
          // or just write validator: isEmail,  //that would suffice
          message: '{VALUE} .. is not a valid email!'
          },

  trim: true,
  minlength: 1,
  unique: true

},
password: {
  type: String,
  require: true,
  minlength: 6
},
tokens: [{
  access: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
}]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var UserObject = user.toObject();

  return _.pick(UserObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access: access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(()=> {
    return token;
  });

};

var User = mongoose.model('User', UserSchema);

module.exports = {User};  //this is same as {User: User}
