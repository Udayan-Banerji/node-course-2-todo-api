// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');  //deconstructuting - pulling out individual items from an object

// var obj = new ObjectID();   //example of using ObjectID
// console.log(obj);           //everytime you run this a new objectID is created

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if (err) {
    return console.log('unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

// db.collection('Todos').findOneAndUpdate({_id: new ObjectID('59ec437d7f56983d7c6e629f')},{
//   $set: {
//     completed: true
//   }
// },{returnOriginal: false}).then((result) => {
//   console.log(result);
// });


  db.collection('Users').findOneAndUpdate({_id: new ObjectID('59ec489f16656e2cc85abcf0')}, {
    $set: {
      name: 'Udayan',
      location: 'Seattle'
    },
    $inc: {
      age: 1
    }
  },{
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  }, (err) => {
    console.log(err);
  });


  //db.close();
});
