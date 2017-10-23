// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');  //destructuting - pulling out individual items from an object

// var obj = new ObjectID();   //example of using ObjectID
// console.log(obj);           //everytime you run this a new objectID is created

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if (err) {
    return console.log('unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({completed: true}).toArray().then((docs) => {  //find returns a MongoDB Cursor, not actual docs bt a pointer with methods
  //                                                        //To array returns a promise
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) =>{
  //   console.log('Unable to fetch todos ', err );
  // }
  // );

  // db.collection('Todos').find().count().then((count) => {  //use promise
  //                                                        //To array returns a promise
  //   console.log(`Todos count: ${count}`);
  //
  // }, (err) =>{
  //   console.log('Unable to fetch todos ', err );
  // }
  // );
  //
  db.collection('Users').find({name: 'Andy'}).count().then((count) => {  //use promise
                                                         //To array returns a promise
    console.log(`Users ${count} `);

  }, (err) =>{
    console.log('Unable to fetch todos ', err );
  }
  );

  db.collection('Users').find({location: 'Kolkata'}).toArray().then((docs) => {  //use promise
                                                         //To array returns a promise
    console.log(`Users`);
    console.log(JSON.stringify(docs, undefined, 2));

  }, (err) =>{
    console.log('Unable to fetch todos ', err );
  }
  );
  //db.close();
});
