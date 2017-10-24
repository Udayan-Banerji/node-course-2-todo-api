var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
  type: String,
  required: true,
  validate: {
          validator: function(v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
          },
          message: '{VALUE} .. is not a valid email!'
        },
  trim: true,
  minlenth: 1
  }
});

var User = mongoose.model('User', userSchema);

module.exports = {User};  //this is same as {User: User}
