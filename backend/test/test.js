const server = require('../app.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

// describe('/GET user', () => {
//     it('it should GET all the users', (done) => {
//       chai.request(server)
//           .get('/users')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });

describe('/POST user', () => {
    it('it should CREATE an employee', (done) => {
      chai.request(server)
          .post('/auth/create-user')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
          });
    });
});

describe('/POST user login', () => {
    it('it should allow users to sign in', (done) => {
      chai.request(server)
          .post('/auth/signin')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
          });
    });
});

// describe('/POST gif', () => {
//     it('it should POST a gif', (done) => {
//       chai.request(server)
//           .post('/gif')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });

// describe('/POST article', () => {
//     it('it should POST an article', (done) => {
//       chai.request(server)
//           .post('/articles')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });

// describe('/PATCH article', () => {
//     it('it should UPDATE an article', (done) => {
//       chai.request(server)
//           .patch('/articles:id')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });

// describe('/DELETE article', () => {
//     it('it should DELETE an article', (done) => {
//       chai.request(server)
//           .delete('/articles:id')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });

// describe('/DELETE gifs', () => {
//     it('it should DELETE an gifs', (done) => {
//       chai.request(server)
//           .delete('/gifs:id')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });;

// describe('/POST artcle comment', () => {
//     it('it should POST a comment for a given article', (done) => {
//       chai.request(server)
//           .post('/articles/articleID/comment')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });

// describe('/POST gif comment', () => {
//     it('it should POST a comment for a given gif', (done) => {
//       chai.request(server)
//           .post('/gifs/gifID/comment')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });

// describe('/GET feeds', () => {
//     it('it should GET all artcles and gifs', (done) => {
//       chai.request(server)
//           .get('/feed')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });

// describe('/GET specific article', () => {
//     it('it should GET a specific article given its ID', (done) => {
//       chai.request(server)
//           .get('/articles/:id')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });

// describe('/GET specific gif', () => {
//     it('it should GET a specific gif given its ID', (done) => {
//       chai.request(server)
//           .get('/gifs/:id')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });

// describe('/GET articles by category', () => {
//     it('it should GET all articles of a certain category', (done) => {
//       chai.request(server)
//           .get('/articles?tag=:tagID')
//           .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//             done();
//           });
//     });
// });
