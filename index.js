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

/*
  User:

  {
    _id: "5fb5853f734231456ccb3b05"
    username: "fcc_test",
  }

  Exercise:

  {
    _id: "5fb5853f734231456ccb3b05"
    description: "test",
    duration: 60,
    date: "Mon Jan 01 1990",
  }

  Log:

  {
    _id: "5fb5853f734231456ccb3b05",
    username: "fcc_test",
    count: 1,
    log: [{
      description: "test",
      duration: 60,
      date: "Mon Jan 01 1990",
    }]
  }
*/
const users = [];
const exercises = [];

const { customAlphabet } = require('fix-esm').require('nanoid');

const createId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 24);

function createUser(username) {
  return { _id: createId(), username };
};

function addUser(user) {
  users.push(user);
}

function getUser(id) {
  return users.find(({ _id }) => _id == id);
}

function getUsers() {
  return users;
}

function createExercise(id, description, duration, date) {
  duration = parseInt(duration);
  date = (date && new Date(date) || new Date()).toDateString();

  return { _id: id, description, duration, date };
}

function addExercise(exercise) {
  exercises.push(exercise);
}

function getExercises(id, from = "", to = "", limit = -1) {
  const user = getUser(id);
  let log = createLog(id);

  if (from)
    log = log.filter(({ date }) => new Date(date) >= new Date(from));

  if (to)
    log = log.filter(({ date }) => new Date(date) <= new Date(to));

  if (limit > 0)
    log = log.slice(0, limit);

  return { ...user, count: log.length, log };
}

function createLog(id) {
  return exercises.filter(({ _id }) => _id == id).map(({ description, duration, date }) => ({ description, duration, date }));
}

/*
 - [x] You can POST to /api/users with form data username to create a new user.
 - [x] The returned response from POST /api/users with form data username will be an object with username and _id properties.
*/
app.post('/api/users', (req, res) => {
  const { username } = req.body;

  const user = createUser(username);

  addUser(user);

  res.json(user);
});

/*
 - [x] You can make a GET request to /api/users to get a list of all users.
 - [x] The GET request to /api/users returns an array.
 - [x] Each element in the array returned from GET /api/users is an object literal containing a user's _id and username.
*/
app.get('/api/users', (req, res) => {
  res.json(getUsers());
});

/*
 - [x] You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
 - [x] The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.
*/
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const exercise = createExercise(_id, description, duration, date);

  addExercise(exercise);

  const { username } = getUser(_id);

  res.json({ username, ...exercise });
});

/*
 - [x] A GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
 - [x] A GET request to /api/users/:_id/logs returns a user object with a count property representing the number of exercises that belong to that user.
 - [x] A GET request to /api/users/:_id/logs will return the user object with a log array of all the exercises added.

 - [x] Each item in the log array that is returned from GET /api/users/:_id/logs is an object that should have a description, duration, and date properties.

 - [x] The description property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string.
 - [x] The duration property of any object in the log array that is returned from GET /api/users/:_id/logs should be a number.
 - [x] The date property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string. Use the dateString format of the Date API.

 - [x] You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.

 - [x] You should provide your own project, not the example URL.
*/
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const exercises = getExercises(_id, from, to, limit);

  console.log(exercises);

  res.json(exercises);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
