var {ObjectID} = require('mongodb');

var express = require('express');
var bodyParser  =require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo}  =require('./models/todo.js');
var {User}  =require('./models/user.js');

var app = express();
const port = process.env.PORT || 3000;

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

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})   //sent an object, so that we can add in other properties to object later
  },(e)=>{
    res.status(400).send(e);
  });

});

app.get('/todos/:id',(req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findById({_id: id}).then((todo) => {
    if(!todo) {
      res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e)=> res.status(400).send(e));


});

app.delete('/todos/:id',(req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e)=>res.status(400).send());


});



app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};






















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
