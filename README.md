# couchdb-request
Minimalist couchdb client on top of request.
Unlike other couchdb-client, this module expose the powerful request object to
enable chaining. This make it easy to use it as a proxy between client (browser) and 
couchDB server.


##Install

    $npm install couchdb-request


##Usage example
```javascript
const bodyParser = require('body-parser');
const express    = require('express');
const couchdb    = require('couchdb-request')('https://admin:password@localhost:5984');
    
var app = express();
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    
  couchdb
  .database('_users')
  .put('org.couchdb.user:' + req.body.email, req.body)
  .on('error', err => console.log(err))
  .on('response', result => sendEmailConfirmation(req.body))
  .pipe(res)
      
})

app.listen(3000);
```

