// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');  //deconstructuting - pulling out individual items from an object

// var obj = new ObjectID();   //example of using ObjectID
// console.log(obj);           //everytime you run this a new objectID is created

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if (err) {
    return console.log('unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // }, (err) => {
  //   console.log('Unable to delete', err);
  // });

  //deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // }, (err) => {
  //   console.log('Unable to delete', err);
  // });

  //findOneandDelete
  db.collection('Users').findOneAndDelete({_id: new ObjectID("59ec72f65e757e9cf3d444c6")
  }).then((result) => {
         //here it returns the deleted document
    console.log(JSON.stringify(result));
  },(err)=> {
    console.log(err);
  });

  // db.collection('Users').deleteMany({name: 'Ram2'}).then((results) => {
  //   console.log(results['result']);
  // },(err) => {
  //   console.log('Could not perform delete',err);
  // });


  //db.close();
});
