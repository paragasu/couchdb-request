'use strict';

const request = require('request');
const debug   = require('debug')('couchdb');

var host, db;

var couchdb = module.exports = function (url){
  host = url;

  return {
    database: database,
    get : get,
    put : put,
    post: post,
    view: view,
    del : del,
    save: save
  }
}

function database(database){
  db = database;
  return couchdb(host);
}

function get(id, cb){
  return request({
    json: true,
    url: [host, db, id].join('/') 
  }, cb)
}

function put(id, data, cb){
  return request({ 
    method: 'PUT',
    json: true,
    url: [host, db, id].join('/'),
    body: data 
  }, cb)
}

function post(id, data, cb){
  return request({
    json: true,
    method: 'POST',
    url: [host, db, id].join('/'),
    body: data
  }, cb)
}

function del(id, cb){
  get(id, (err, res) => {
    if(err) throw(err);
    let req = [host, db, id, '?rev=' + res.body._rev].join('/');
    request({
      method: 'DELETE',
      json: true,
      url: req
    }, cb)
  })
}


function save(id, data, cb){
  get(id, (err, res)=>{
    if(res) data._rev = res.body._rev;
    put(id, data, cb);
  })
}


/**
 * query couchdb view. the key must be of type string and double quoted (")
 * @param design design name path
 * @param opts is assume to be key if string
 *        if object then assume the option as in 
 *        http://docs.couchdb.org/en/1.6.1/api/ddoc/views.html
 * @param cb callback
 */
function view(design, opts, cb){
  const qs = require('querystring');
  let v    = design.split('/'), _db = v[0], viewName=v[1];
  let u    = (typeof opts === "object") ? qs.stringify(opts) : 'key="' + opts + '"';
  let url  = [host, db, '_design', _db, '_view', viewName, '?' + u];
  return request({
    json: true,
    url: url.join('/')
  }, cb)
}
