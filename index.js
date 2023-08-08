const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.urlencoded({ extended: true }));

const { customAlphabet } = require("fix-esm").require('nanoid');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 24);

const users = [{ username: "fcc_test", _id: "5fb5853f734231456ccb3b05" }]; // TODO: write real "data storage" logic?
const exercises = [];

/*
 - [x] You can POST to /api/users with form data username to create a new user.
 - [x] The returned response from POST /api/users with form data username will be an object with username and _id properties.
*/
app.post('/api/users', (req, res) => {
  const user = { username: req.body.username, _id: nanoid() };

  users.push(user); // TODO: write logic to catch errors if the action fails

  res.json(user);
});

/*
 - [-] You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
 - [-] The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.
*/
app.post('/api/users/:_id/exercises', (req, res) => {
  const _id = req.params._id;

  const index = users.findIndex(user => user._id === _id);

  const user = users[index];

  let { description, duration, date } = req.body;

  date = date || new Date();

  const exercise = { ...user, description, duration, date };

  exercises[index] = exercise; // TODO: safe changes properly

  res.json(exercise);
});

/*
 - [x] You can make a GET request to /api/users to get a list of all users.
 - [x] The GET request to /api/users returns an array.
 - [x] Each element in the array returned from GET /api/users is an object literal containing a user's username and _id.
*/
app.get('/api/users', (req, res) => {
  res.json(users);
});

/*
 - [ ] You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
 - [ ] A request to a user's log GET /api/users/:_id/logs returns a user object with a count property representing the number of exercises that belong to that user.
 - [ ] A GET request to /api/users/:_id/logs will return the user object with a log array of all the exercises added.
 - [ ] Each item in the log array that is returned from GET /api/users/:_id/logs is an object that should have a description, duration, and date properties.
 - [ ] The description property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string.
 - [ ] The duration property of any object in the log array that is returned from GET /api/users/:_id/logs should be a number.
 - [ ] The date property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string. Use the dateString format of the Date API.
 - [ ] You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.

 - [ ] You should provide your own project, not the example URL.
*/

/*
  Exercise:

  {
    username: "fcc_test",
    description: "test",
    duration: 60,
    date: "Mon Jan 01 1990",
    _id: "5fb5853f734231456ccb3b05"
  }

  User:

  {
    username: "fcc_test",
    _id: "5fb5853f734231456ccb3b05"
  }

  Log:

  {
    username: "fcc_test",
    count: 1,
    _id: "5fb5853f734231456ccb3b05",
    log: [{
      description: "test",
      duration: 60,
      date: "Mon Jan 01 1990",
    }]
  }
*/

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
