const express = require('express');
const os = require('os');
const mysql = require('mysql');
const connection = mysql.createConnection({
	host: process.env.CTFLEARN_DB_HOST,
	port: process.env.CTFLEARN_DB_PORT,
	user: process.env.CTFLEARN_DB_USER,
	password: process.env.CTFLEARN_DB_PASSWORD,
	database: 'ctflearn'
});

const app = express();

app.use(express.static('dist'));

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.get('/api/submissions/count', (req, res) => {
	console.log('/api/submissions/count');
	// connection.connect();

	connection.query('SELECT COUNT(*) FROM ctflearn.comments LIMIT 10;', function(error, results, fields) {
		console.log('Error', error);
		console.log('-------------------------');
		console.log(results);
		console.log('-------------------------');
		res.send(results);
		// console.log(results[0]);
		// console.log(results[0].RowDataPacket);

		if (error) throw error;
		// console.log('The solution is: ', results[0].solution);
	});

	// connection.end();
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
