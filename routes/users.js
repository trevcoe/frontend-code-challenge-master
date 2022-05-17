var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('../lib/logger');
var log = logger();
const nunjucks = require('nunjucks')
var users = require('../init_data.json').data;
var curId = _.size(users);

/* My goal is to get the user data from init_data.json, and display it in admin.html.
I've tried a million different things but I cannot get anything to work. This is the best 
I can come up with */

// I copied this from the docs, I think its necessary in order for nunjucks to work
// I'm not sure if it should be here, though
var app = express();

nunjucks.configure('public', { /* I put 'public' here. I don't know what should go here
it has 'views' by default. I believe all my html is supposed to be in a folder called views in order 
for nunjucks to work, but when I created the folder and moved the html to it the app breaks.
I tried to get the app to find the new location by changing the path in index.js, but localhost:3000 turns up 404.
Changing it to localhost:3000/views in the browser will locate the files but I just couldnt get 
the server to launch localhost:3000/views, it will only launch localhost:3000. I stopped messing with it because 
I'm not sure it's even necessary  */

    autoescape: true,
    express: app
});

app.get('/', function(req, res) {
    res.render('index.html');
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.json(_.toArray(users));
  return res.render("/admin.html", {users}) 
  /* I put line 13 here. I want to render the page 
  while sending user data along with it. It doesn't seem to work though */
});

// I've changed nothing below this line



/* Create a new user */
router.post('/', function(req, res) {
  var user = req.body;
  user.id = curId++;
  if (!user.state) {
    user.state = 'pending';
  }
  users[user.id] = user;
  log.info('Created user', user);
  res.json(user);
});

/* Get a specific user by id */
router.get('/:id', function(req, res, next) {
  var user = users[req.params.id];
  if (!user) {
    return next();
  }
  res.json(users[req.params.id]);
});

/* Delete a user by id */
router.delete('/:id', function(req, res) {
  var user = users[req.params.id];
  delete users[req.params.id];
  res.status(204);
  log.info('Deleted user', user);
  res.json(user);
});

/* Update a user by id */
router.put('/:id', function(req, res, next) {
  var user = req.body;
  if (user.id != req.params.id) {
    return next(new Error('ID paramter does not match body'));
  }
  users[user.id] = user;
  log.info('Updating user', user);
  res.json(user);
});


module.exports = router;
