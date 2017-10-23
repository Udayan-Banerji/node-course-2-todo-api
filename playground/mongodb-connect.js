// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');  //destructuting - pulling out individual items from an object

// var obj = new ObjectID();   //example of using ObjectID
// console.log(obj);           //everytime you run this a new objectID is created

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if (err) {
    return console.log('unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   complete: false
  // }, (err, result) => {
  //   if(err) {
  //     console.log('Unable to insert record');
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2))  //undefined for filter and 2 for indentation
  // });

  //Insert into users (name, age, location)

  // db.collection('Users').insertOne({
  //   name: 'The greatest programmer in the world',
  //   age: 12,
  //   location: 'Kolkata'
  // },(err, result) => {
  //   if(err){
  //    return  console.log('Unable to insert record');
  //   }
  //
  //   //console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  db.close();
});
