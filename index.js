const express = require('express');
const server = express();
const port = process.env.PORT || 3000
var cors = require('cors');
server.use(express.json());

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('connected');
    // Start listening only after connection is established
    server.listen(port, () => {
      console.log('server started');
    });
  });
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Useri = mongoose.model('useri', userSchema);

server.post('/', async (req, res) => {
  try {
    let useri = new Useri();
    useri.username = req.body.username;
    useri.password = req.body.password;
    await useri.save();
    console.log('User created successfully!');
    res.send('User created successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong!');
  }
});
server.get('/debug', (req, res) => {
  res.send('Debugging information goes here.');
});
// Add these lines to allow cross-origin requests
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Export the server variable instead of the handler function
module.exports = server;
