var app = require('../server.js'),
assert = require('assert'),
chai = require('chai'),
request = require('supertest');

describe('POST /create', function() {
  it('create operation test', function(done) {
  request(app)
    .post('/create')
    .send({
        "key":"freshWork",
        "value":{"key11":"value","key12":"value2","Time_To_Live":1000}
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    })
  });
});

describe('POST /read', function() {
  it('read paticular key json test', function(done) {
  request(app)
    .post('/read')
    .send({
        "key":"freshWork"
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    })
  });
});
describe('POST /read', function() {
  it('read whole json file test', function(done) {
  request(app)
    .post('/read')
    .send()
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    })
  });
});

describe('Delete /delete', function() {
  it('delete paticular key from json file test', function(done) {
  request(app)
    .delete('/delete/freshWork')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    })
  });
});