const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59f1c4c1392a788c0e2fcac511';
//
// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos',todos);
// });
//
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById({
//   _id: id
// }).then((todo) => {
//   if(!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((e) => { console.log(e);});

 var id = '59ef007ced79f600492066d0';


User.findById({
  _id: id
}).then((user) => {
    if(!user) {
      return console.log('Id not found');
    }
    console.log('User by id', JSON.stringify(user,undefined,2));
}).catch((e) =>  console.log(e));
