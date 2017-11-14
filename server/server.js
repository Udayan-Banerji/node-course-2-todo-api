require('./config/config');

const _=require('lodash');
const express = require('express');
const bodyParser  =require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');


var {mongoose} = require('./db/mongoose');
var {Todo}  =require('./models/todo.js');
var {User}  =require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js')

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
    return  res.status(404).send({error: 'Invalid object'});
  }

  Todo.findById({_id: id}).then((todo) => {
    if(!todo) {
      return res.status(404).send({error: 'Todo not found'});
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

app.patch('/todos/:id',(req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

    if (!ObjectID.isValid(id)) {
      res.status(404).send({error:'Not valid'});
    }

    if(_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();     //adding a new field to body, completedAt
    }
    else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if(!todo) {
        return res.status(404).send({error: 'Could not update the Todo because the ID does not exist'});
      }

      res.status(200).send({todo});
    }).catch((e) => {
       res.status(400).send({e: 'Unable to update the Todo.'});
    });

});



// app.patch('/todos/:id', (req, res) => {
//   var {id}  = req.params;
//   var body = _.pick(req.body, ['text', 'completed']);
//
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send({ error: 'Could not update the Todo because the ID is invalid.' });
//   }
//
//   if (_.isBoolean(body.completed) && body.completed) {
//     body.completedAt = new Date().getTime();
//   } else {
//     body.completed = false;
//     body.completedAt = null;
//   }
//
//   Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
//     .then((todo) => {
//       if (!todo) {
//         return res.status(404).send({ error: 'Could not update the Todo because the ID does not exist.' });
//       }
//       res.send({ todo });
//     })
//     .catch((error) => {
//       res.status(400).send({ error: 'Unable to update the Todo.' });
//     });
// });

app.post('/users/',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  user = new User(body);

  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=> {
    res.header('x-auth',token ).send(user);
  }).catch( (err)=>{
    res.status(400).send(err);
  });
});



app.get('/users/me',authenticate,(req,res) => {
   res.send(req.user);
});

app.post('/users/login',(req,res) => {
       var body = _.pick(req.body,['email', 'password']);

       User.findByCredentials(body).then((user)=> {
         return  user.generateAuthToken().then((token) => {
            res.header('x-auth',token ).send(user);
          });
       }).catch((e)=> res.status(400).send({error: 'User not found'}));


});


app.delete('/users/me/token',authenticate, (req, res) => {
  //console.log(req.token);
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
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
