const {ObjectID}  = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../server/models/todo');
const {User} = require('./../../server/models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'aRich@example.com',
  password: 'passOne',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'aSuperRich@example.com',
  password: 'passTwo',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const todos = [{
  _id: new ObjectID,
  text: "first test todo",
  _creator: userOneId
}, {
  _id: new ObjectID,
  text: "second test todo",
  _creator: userTwoId,
  completed: true,
  completedAt: 333
}];


const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo  =new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(()=> done());
};

module.exports = {todos, populateTodos, users, populateUsers}
