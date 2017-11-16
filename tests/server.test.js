const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
//mocha and nodemon do no

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () =>{
  it('should create a new todo', (done) => {
    var testText = 'Test todo text';

    request(app)          //using supertest
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
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
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{                            //custom assertion
          expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });

  });

  describe('Get /todos/:id', () => {
    it('should return a todo doc',(done) => {
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
        //expect(res.body.todo.length).toBe(1);  //no length for a single record
      })
      .end(done)
    });


      it('should NOT return a todo doc created by other users',(done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done)
      });

   it('should return 404 if todo not found', (done) => {
     var hexId = new ObjectID().toHexString();
     request(app)
     .get(`/todos/${hexId}`)
     .set('x-auth',users[0].tokens[0].token)
     .expect(404)
     .end(done);

   });

   it('should return 404 for non object id',(done) => {
     var id = 123;
     request(app)
     .get(`/todos/${id}`)
     .set('x-auth',users[0].tokens[0].token)
     .expect(404)
     .end(done);
   });

  });


  describe('Delete /todos/:id route', () =>{
    it('should remove todo doc',(done)=>{
      var hexId = todos[1]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
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


      it('should Not remove todo doc of other user',(done)=>{  //trying to delete user[1]'s todo by user[1]
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end((err, res)=> {
          if(err) {
            return done(err);
          }
          Todo.findById(hexId).then((todo)=> {expect(todo).toExist();
          }).catch((e) => {done(e)});
        });
        done();
      });

    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toHexString();
      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done);

    });

    it('should return 404 if object id is invalid',(done) => {
      var id = 123;
      request(app)
      .delete(`/todos/${id}`)
      .set('x-auth',users[1].tokens[0].token)
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
      .set('x-auth',users[0].tokens[0].token)
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


      it('should not update the todo when another user is attempting to do so',(done)=>{
        var hexId1 = todos[0]._id.toHexString();
        var testText1  = 'Test 1 Text billion';
        console.log('*********1',hexId1);
        request(app)
        .patch(`/todos/${hexId1}`)
        .set('x-auth',users[1].tokens[0].token)
        .send({completed: true, text: testText1})
        .expect(404)
        .end(done);
      });

    it('should clear completedAt when todo is not completed',(done)=>{
      var hexId2 = todos[1]._id.toHexString();
      var testText2  = 'Test 2 Text billion';
      console.log('*********2',hexId2);
      request(app)
      .patch(`/todos/${hexId2}`)
      .set('x-auth',users[1].tokens[0].token)
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

  describe('Get /users/me',() => {
    it('should return user if authenticated', (done) => {
      request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done);
    });

    it('should return 401 if not authenticated',(done) => {
       request(app)
       .get('/users/me')
       .set('x-auth','abcdefg')    //or remove this
       .expect(401)
       .expect((res)=> {
         expect(res.body).toEqual({error: 'Authentication required - user not found'});
       })
       .end(done);
    });

  });

  describe('POST /users', () => {
    it('should create an user',(done) => {
      var email = 'email@example.com';
      var password = 'pass123';

      request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err,res) => {                  //custom end function to check the database for existing data
        if (err) {
          return done(err);
        }

        User.find({email: email}).then((users) => {
          expect(users.length).toBe(1);
          expect(users[0].email).toBe(email);
          expect(users[0].password).toNotBe(password);
          done();

        }).catch((e) => {done(e)});
      });
    });

    it('should return validation errors if request invalid', (done) => {
       var email = 'invalid@email';
       var password = 'invP';

       request(app)
       .post('/users')
       .send({email,password})
       .expect(400)
       .end(done);


          // var email = 'valid@email.com';
          // var password = 'invPs';
          //
          // request(app)
          // .post('/users')
          // .send({email,password})
          // .expect(400)
          // .end(done);

    });

    it('should not create an user if email is in use', (done) => {
       var email = users[0].email;
       var password = 'validPassword';

       request(app)
       .post('/users')
       .send({email, password})
       .expect(400)
       .end(done);


    });


  });

  describe('POST /users/login',()=>{
    it('should login a user and return auth token',(done) => {
      request(app)
      .post('/users/login')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {return done(err);}
        User.findById(res.body._id).then((user) => {

            // console.log('Found in test',JSON.stringify(user));
            // console.log('Found token in test',JSON.stringify(user.tokens[user.tokens.length-1]));
            // console.log('Res headers x-auth',res.headers['x-auth']);
          expect(user.tokens[user.tokens.length-1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e)=> done(e));
      });

    });

    it('should reject invalid login',(done) => {
      request(app)
      .post('/users/login')
      .send({
        email: users[0].email,
        password: 'SomeInvalidPassword'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
        //expect(users[0].tokens.length).toBe(1);   //better to check from database as below
      })
      .end((err, res) => {
        if (err) {return done(err);}
        User.findById(users[0]._id).then((user) => {

            // console.log('Found in test',JSON.stringify(user));
            // console.log('Found token in test',JSON.stringify(user.tokens[user.tokens.length-1]));
            // console.log('Res headers x-auth',res.headers['x-auth']);
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e)=> done(e));
      });

    });
  });

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if(err) {done(err)}
      else {
        User.find(users[0]).then((user)=> {
           {
            expect(user.tokens[0].length).toBe(0);
          }

        },(err)=>done(err));
        done();
      }
    });
  });
});
