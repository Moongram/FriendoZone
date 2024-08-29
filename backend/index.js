const express = require('express');
const mongoose = require('mongoose');
const auth = require('./src/auth');
const profile = require('./src/profile')
const following = require('./src/following')
const articles = require('./src/articles')
require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = {
     origin: process.env.FRONTEND_URL, 
     credentials: true
};

mongoose.connect(process.env.CONNECTION_STRING);

const app = express();
app.enable('trust proxy');

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());

auth(app);
profile(app);
following(app);
articles(app);


// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
     const addr = server.address();
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
});