var mongoose = require('mongoose');

mongoose.Promise = global.Promise;   //this tells mongoose which Promise library                                   // (the built in promise library in JS)
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose: mongoose
};
