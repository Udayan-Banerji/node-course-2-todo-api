var express = require('express');
var bodyParser  =require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo}  =require('./models/todo');
var {User}  =require('./models/user');

var app = express();

app.use(bodyParser.json());  //this is the middleware

app.post('/todos', (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.listen(3000, () => {
  console.log('started on port 3000');
});
























//
// var newUser = new User({
//   email: 'ub@gmail.com'
// });
//
// newUser.save().then((doc) => {
//   console.log('Saved user', doc);
// }, (err) => {
//   console.log(err);
// });
//
//
//
// // var newTodo = new Todo({
// //   text: 'Cook Dinner'
// // });  //none of the attributes above are "required" so we didn't specify any more
// //
// // newTodo.save().then((doc) => {
// //   console.log('Saved Todo', doc);
// // }, (err) => {
// //   console.log('Unable to save Todo')
// // });
//
// var nextTodo = new Todo({
//   text: 'Get million dollar job',
//   completed: true,
//   completedAt: Date.now()
// });
// //
// // nextTodo.save().then((doc) => {
// //   console.log('Saved next Todo', doc);
// // }, (err) => {
// //   console.log('Could not save Todo');
// // });
