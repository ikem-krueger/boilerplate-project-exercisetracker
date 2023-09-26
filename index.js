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

const users = []; // { _id, username }
const exercises = []; // { _id, description, duration, date }

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

// create user
app.post('/api/users', (req, res) => {
  const { username } = req.body;

  const user = createUser(username);

  addUser(user);

  res.json(user);
});

// get users
app.get('/api/users', (req, res) => {
  res.json(getUsers());
});

// add exercise
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const exercise = createExercise(_id, description, duration, date);

  addExercise(exercise);

  const { username } = getUser(_id);

  res.json({ username, ...exercise }); // as wished
});

// get exercises
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  res.json(getExercises(_id, from, to, limit));
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
