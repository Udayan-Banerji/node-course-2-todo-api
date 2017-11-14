const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

  return user.save().then(()=> {    //adds the token to the end of the array of tokens
    return token;
  });

};

UserSchema.methods.removeToken = function (tokenPassed) {    //this is an instance method
  var user = this;

  return  user.update({                               //**return allows us to chain the calls
    $pull: {                                          //this is mongodb $pull which removes the object
      tokens: {                                       //Pull (remove) from the tokens array
        token: tokenPassed                            //oject having token = toksnPassed
      }
    }

  });

};

UserSchema.statics.findByToken = function (token) {   //statics only creates Model methods (not instance)
   var User = this;
   var decoded;  //undefinded variable

   try {
     decoded = jwt.verify(token,'abc123');
     //console.log(JSON.stringify(decoded));
   } catch (e) {
      // return new Promise((resolve, reject)=> {
      //   reject();
      // });
      return Promise.reject();
   }

   return User.findOne({
     _id: decoded._id,
     'tokens.token': token,                 //because there is "." use the ''
     'tokens.access': 'auth'
   });
 };

 UserSchema.statics.findByCredentials = function (body) {

      return  User.find({email: body.email}).then((users_db) => {
         if(users_db.length!== 1) {
           return Promise.reject();
         }

         else {
           // console.log('Found user by credentials',JSON.stringify(users_db[0]));
           // console.log('Found user token',JSON.stringify(users_db[0].tokens[0]));

           return new Promise((resolve, reject) => {

              bcrypt.compare(  body.password, users_db[0].password, function(err, isMatch) { //only supports callbacks, not promises

                          if(isMatch) {
                            resolve(users_db[0]);
                          } else {
                            reject({error: "Passwords don't match"});
                          }
              });
           });

         }
       },(e)=>{
         reject({error: "Exception"});
       });

 };

 UserSchema.pre('save', function(next) {
   var user = this;
   var hash = '000';
   var hashedPassword = '000';
   if (user.isModified('password')) {
     bcrypt.genSalt(10,(err, salt)=>{
       bcrypt.hash(user.password, salt, (err, hashedPassword) => {
         //console.log('Hashed:' ,hashedPassword);
         hash = hashedPassword;
         user.password = hashedPassword;
         next()
       });
     });
   } else {
   next();
   }
 });

var User = mongoose.model('User', UserSchema);

module.exports = {User};  //this is same as {User: User}
