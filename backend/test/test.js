const server = require('../app.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

// const authenticatedUser = chai.request(server);

userCredentials = {
  email: "admin@admin.team",
  password: "admin"
}

beforeEach(function(done){
  chai.request(server)
    .post('/auth/signin')
    .send(userCredentials)
    .end(function(err, res){
      res.should.have.status(200);
      res.body.should.be.a('object');
      token = res.body.data.token
    done();
    });
});

describe('/POST user login', () => {
  it('it should allow users to sign in', (done) => {
    data ={
      email: "admin@admin.team",
      password: "admin"
    }
    chai.request(server)
        .post('/auth/signin')
        .send(data)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
          done();
        });
  });
});

describe('/POST user', () => {
  it('it should CREATE an employee', (done) => {
    let employee = {
      "username": "testemployee5",
      "email": "test9@team.com",
      "phone_no": 123456999,
      "status": 1,
      "first_name": "John",
      "last_name": "Doe",
      "job_position": 1,
      "department": 4,
      "address": "4th street Avenue",
      "avatar": "static/123"
  }
      chai.request(server)
        .post('/auth/create-user')
        .send(employee)
        .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
          done();
        });
  });
});

describe('/POST gif', () => {
    it('it should POST a gif', (done) => {
      chai.request(server)
          .post('/posts/gifs')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});

describe('/POST article', () => {
    it('it should POST an article', (done) => {
      chai.request(server)
          .post('/posts/articles')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});

describe('/PATCH article', () => {
    it('it should UPDATE an article', (done) => {
      chai.request(server)
          .patch('/article/:articleID')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});

describe('/DELETE article', () => {
    it('it should DELETE an article', (done) => {
      chai.request(server)
          .delete('/articles:id')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});

describe('/DELETE gifs', () => {
    it('it should DELETE an gifs', (done) => {
      chai.request(server)
          .delete('/gifs:id')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});;

describe('/POST article comment', () => {
    it('it should POST a comment for a given article', (done) => {
      chai.request(server)
          .post('/articles/articleID/comment')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});

describe('/POST gif comment', () => {
    it('it should POST a comment for a given gif', (done) => {
      chai.request(server)
          .post('/gifs/gifID/comment')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});

describe('/GET feeds', () => {
    it('it should GET all artcles and gifs', (done) => {
      chai.request(server)
          .get('/feed')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});

describe('/GET specific article', () => {
    it('it should GET a specific article given its ID', (done) => {
      chai.request(server)
          .get('/articles/:id')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});

describe('/GET specific gif', () => {
    it('it should GET a specific gif given its ID', (done) => {
      chai.request(server)
          .get('/gifs/:id')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});

describe('/GET articles by category', () => {
    it('it should GET all articles of a certain category', (done) => {
      chai.request(server)
          .get('/articles?tag=:tagID')
          .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
            done();
          });
    });
});
