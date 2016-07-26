# couchdb-request

[![Build Status](https://travis-ci.org/paragasu/couchdb-request.svg?branch=master)](https://travis-ci.org/paragasu/couchdb-request)

Minimalist couchdb client on top of request.
Unlike other couchdb-client, this module expose the powerful request object to enable chaining. 
This make it easy to use it as a proxy between client (browser) and couchDB server. 


This in turn allows us to do additional action like sending email confirmation after user successfully register or add additional check at the login form to rate limit login attempt.


##Install

    $npm install couchdb-request


##Method

### API
All method is basically a very light [request](https://www.npmjs.com/package/request) abstraction and every call will
return the same request object. All method from [request](https://www.npmjs.com/package/request) module is available.
Please refer the CouchDB API documentation at [docs.couchdb.org](http://docs.couchdb.org/en/1.6.1/http-api.html) for available
REST API.

#### configuration
```javascript
const couchdb = require('couchdb-request')(opts)
```
This api should be called first to set the correct database parameter
before calling any database action method.
- opts full url sytax eg: https://admin:password@localhost:5984


#### database(url)
Database name to query to
- database name eg: booking


#### get(id, [callback])
Get database value
- id document id
- callback *(optional)* function to execute after request complete


#### put(id, data, [callback])
Insert data to database
- id document id
- data *(json)* object data to save
- callback *(optional)* function to execute after request complete

#### post(id, data, [callback])
Insert data to database
- id document id
- data *(json)* object data to save
- callback *(optional)* function to execute after request complete


#### del(id, callback)
Delete data from database
- id document id
- data *(json)* object to save 
- callback function to execute after request complete

#### save(id, data, callback)
Update existing data. This api will automatically get the latest rev to use for updating the data.
- id document id
- data *(json)* object to save
- callback function to execute after request complete


#### view(design, opts, [callback])
Query rows of data using views
- id view id
- opts *(json)* options parameter as [documented here](http://docs.couchdb.org/en/1.6.1/api/ddoc/views.html)
- callback *(optional)* function to execute after request complete

##Usage example
```javascript
const bodyParser = require('body-parser');
const express    = require('express');
const couchdb    = require('couchdb-request')('https://admin:password@localhost:5984');
    
var app = express();
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  couchdb
  .database('_users') //select database
  .put('org.couchdb.user:' + req.body.email, req.body) //method
  .on('error', err => console.log(err)) //log on error
  .on('response', result => sendEmailConfirmation(req.body)) //send email on success
  .pipe(res) //stream to browser
      
})

app.listen(3000);
```


Using callback function

```javascript
couchdb
.database('_users')
.get('org.couchdb.user:myuser@hello.com', res => {
  console.log(res);
})
```



## Reference
- [CouchDB API](http://docs.couchdb.org/en/1.6.1/http-api.html)
- [CouchDB View Options](http://docs.couchdb.org/en/1.6.1/api/ddoc/views.html)
- [Request documentation](https://github.com/request/request)

