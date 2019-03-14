const express = require('express');
const os = require('os');
const Promise = require('bluebird');

const queryUsers = require('./queries/queryUsers');
const querySubmissions = require('./queries/querySubmissions');
const queryComments = require('./queries/queryComments');
const queryGroups = require('./queries/queryGroups');

const mysql = require('mysql');
const connection = mysql.createConnection({
	host: process.env.CTFLEARN_DB_HOST,
	port: process.env.CTFLEARN_DB_PORT,
	user: process.env.CTFLEARN_DB_USER,
	password: process.env.CTFLEARN_DB_PASSWORD,
	database: 'ctflearn',
	multipleStatements: true
});

const app = express();

app.use(express.static('dist'));

app.get('/api/submissions', (req, res) => {
	querySubmissions(req, res, connection);
});

app.get('/api/users', (req, res) => {
	queryUsers(req, res, connection);
});

app.get('/api/comments', (req, res) => {
	queryComments(req, res, connection);
});

app.get('/api/groups', (req, res) => {
	queryGroups(req, res, connection);
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
