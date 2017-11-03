const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
//mocha and nodemon do no

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');


const todos = [{
  _id: new ObjectID,
  text: "first test todo"
}, {
  _id: new ObjectID,
  text: "second test todo",
  completed: true,
  completedAt: 333
}];



beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () =>{
  it('should create a new todo', (done) => {
    var testText = 'Test todo text';

    request(app)          //using supertest
      .post('/todos')
      .send({text: testText})      //gets converted to JSON by supertest
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(testText);
      })
      .end((err,res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text: testText}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(testText);
          done();

        }).catch((e) => {done(e)});
      });
    });

    it('should not create todo with invalid data', (done) => {
      var testText = '';
      console.log("*********Got there****************1");

          request(app)          //using supertest
            .post('/todos')
            .send({text: testText})      //gets converted to JSON by supertest
            .expect(400)
            // .expect((res) => {
            //   expect(res.body.text).toNotBe(text);
            // })
            .end((err,res) => {
              if (err) {
                return done(err);
              }

              Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                //expect(todos[0].text).toBe(testText);  //can't check for ""
                done();

              }).catch((e) => {done(e)});
      });

      console.log("*********Got there****************2");
    });

  });

  describe('Get /todos', () => {
    it('should get the 2 test todos',(done) => {

      request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{                            //custom assertion
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });

  });

  describe('Get /todos/:id', () => {
    it('should return todo doc',(done) => {
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
        //expect(res.body.todo.length).toBe(1);  //no length for a single record
      })
      .end(done)
    });

   it('should return 404 if todo not found', (done) => {
     var hexId = new ObjectID().toHexString();
     request(app)
     .get(`/todos/${hexId}`)
     .expect(404)
     .end(done);

   });

   it('should return 404 for non object id',(done) => {
     var id = 123;
     request(app)
     .get(`/todos/${id}`)
     .expect(404)
     .end(done);
   });

  });


  describe('Delete /todos/:id route', () =>{
    it('should remove todo doc',(done)=>{
      var hexId = todos[1]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res)=> {
        if(err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo)=> {expect(todo).toNotExist();
        }).catch((e) => {done(e)});
      });
      done();
    });

    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toHexString();
      request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);

    });

    it('should return 404 if object id is invalid',(done) => {
      var id = 123;
      request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
    });

  });


  describe('PATCH /todos/:id', ()=>{
    it('should update the todo',(done)=>{
      var hexId1 = todos[0]._id.toHexString();
      var testText1  = 'Test 1 Text billion';
      console.log('*********1',hexId1);
      request(app)
      .patch(`/todos/${hexId1}`)
      .send({completed: true, text: testText1})
      .expect(200)
      .expect((res) => {
          console.log(res.body.todo.text);
          expect(res.body.todo.text).toBe(testText1);
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
    });

    it('should clear completedAt when todo is not completed',(done)=>{
      var hexId2 = todos[1]._id.toHexString();
      var testText2  = 'Test 2 Text billion';
      console.log('*********2',hexId2);
      request(app)
      .patch(`/todos/${hexId2}`)
      .send({completed: false, text: testText2})
      .expect(200)
      .expect((res) => {
          console.log(res.body.todo.text);
          expect(res.body.todo.text).toBe(testText2);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
    });

  });
