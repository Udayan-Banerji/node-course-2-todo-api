const expect = require('expect');
const request = require('supertest');
//mocha and nodemon do no

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => {
    done();
  });
});

describe('POST /todos', () =>{
  it('should createe a new todo', (done) => {
    var text = 'Test todo text';

    request(app)          //using supertest
      .post('/todos')
      .send({text})      //gets converted to JSON by supertest
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();

        }).catch((e) => {done(e)});
      });
    });

    it('should not create todo with invalid data', () => {
      var text = '';

      request(app)
      .post('todos')
      .send({text})
      .expect(400)
      .expect((res)=>{
        expect(res.body.text).toNoBe(text)   //see the MJacson github expect
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();

        }).catch((e)=> {done(e)} );
      });
    });

  });
