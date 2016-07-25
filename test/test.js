'use strict';

const nock    = require('nock');
const test    = require('tape'); 
const couchdb = require('../index')('http://localhost:5984');

test('setup', t => {
  nock('http://localhost:5984')
    .put('/_users/org.couchdb.user:hello@world.com')
    .reply(201)
    .get('/_users/org.couchdb.user:hello@world.com')
    .reply(200)
    .post('/_users/org.couchdb.user:hello@world.com')
    .reply(200)
 
  t.end()
})


test('Create new doc', t => {
  couchdb
  .database('_users')
  .put('org.couchdb.user:hello@world.com')
  .on('response', res => {
    t.equals(res.statusCode, 201, 'doc created')
    t.end()
  })
})


test('Get document id', t => {
  couchdb
  .database('_users')
  .get('org.couchdb.user:hello@world.com')
  .on('response', res => { 
    t.equals(res.statusCode, 200, 'get doc')
    t.end() 
   })
})


test('Update doc', t => {
  couchdb
  .database('_users')
  .post('org.couchdb.user:hello@world.com')
  .on('response', res => {
    t.equals(res.statusCode, 200, 'doc updated')
    t.end()
  })
})

//TODO delete doc
//TODO save doc

test('teardown', t => {
  t.end()
})
