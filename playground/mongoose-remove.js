const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// todo: remove

// Todo.remove({}).then((result) => {
//   console.log(JSON.stringify(result.result,undefined,2));
// });

//Todo.findOneAndRemove()

Todo.findByIdAndRemove('59f5726217d09556d6712033').then((todo) => {
  console.log(todo);
})

Todo.findByOneAndRemove({_id: new ObjectID('59f5730617d09556d6712067')}).then((todo) => {
  console.log(todo);
})
