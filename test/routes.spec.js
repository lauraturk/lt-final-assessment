process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('Client Routes', () => {
  before((done) => {
    knex.migrate.latest()
    .then(() => {
      done();
    });
  });

  it('should return the homepage', (done) => {
    chai.request(server)
    .get('/')
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });

  it('should return an error if not directed to homepage', (done) => {
    chai.request(server)
    .get('/sadpath')
    .end((err, res) => {
      res.should.have.status(404);
      done();
    })
  })
});

describe('API Routes', () => {
  before((done) => {
    knex.migrate.latest()
    .then(() => {
      done();
    });
  });

  beforeEach((done) => {
    knex.seed.run()
    .then(() => {
      done();
    });
  });

  it('should return the inventory', (done) => {
    chai.request(server)
    .get('/api/v1/inventory')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.should.be.a('object');
      res.body.length.should.equal(2);
      res.body[0].should.have.property('item_title');
      res.body[0].should.have.property('item_description');
      res.body[0].should.have.property('item_image');
      res.body[0].should.have.property('item_price');
      done();
    })
  })
})
