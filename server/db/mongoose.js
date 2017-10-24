var mongoose = require('mongoose');

mongoose.Promise = global.Promise;   //this tells mongoose which Promise library                                   // (the built in promise library in JS)
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose: mongoose
};
