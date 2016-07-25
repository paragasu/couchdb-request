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


/**
 * configure which database to query to
 * @param string database
 */
function database(database){
  db = database;
  return couchdb(host);
}


/**
 * get the document info
 * @param id document id
 * @param callback optional callback function to execute after request complete
 */
function get(id, cb){
  return request({
    json: true,
    url: [host, db, id].join('/') 
  }, cb)
}


/**
 * create new document and autogenerate doc id
 * @param id document id
 * @param json object data
 * @param optional callback function
 */
function put(id, data, cb){
  return request({ 
    method: 'PUT',
    json: true,
    url: [host, db, id].join('/'),
    body: data 
  }, cb)
}


/**
 * update document specified by doc id
 * @param id document id
 * @param data json object
 * @param cb optional callback function
 */
function post(id, data, cb){
  return request({
    json: true,
    method: 'POST',
    url: [host, db, id].join('/'),
    body: data
  }, cb)
}


/**
 * delete document
 * @param id document id
 * @param cb optional callback function
 */
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


/**
 * save document
 * automatically find out the latest revision
 * @param id document id
 * @param data json object
 * @param cb optional callback function
 */
function save(id, data, cb){
  get(id, (err, res)=>{
    if(res) data._rev = res.body._rev;
    put(id, data, cb);
  })
}


/**
 * query couchdb view. the key must be of type string and double quoted (")
 * @param design design name path
 * @param opts assume option is in http://docs.couchdb.org/en/1.6.1/api/ddoc/views.html
 *             or key if string provided
 * @param cb callback
 */
function view(design, opts, cb){
  const qs = require('querystring');
  let v    = design.split('/'), designName = v[0], viewName=v[1];
  let u    = (typeof opts === "object") ? qs.stringify(opts) : 'key="' + opts + '"';
  let url  = [host, db, '_design', designName, '_view', viewName, '?' + u];
  return request({
    json: true,
    url: url.join('/')
  }, cb)
}
