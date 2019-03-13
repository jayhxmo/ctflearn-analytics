const express = require('express');
const os = require('os');
const Promise = require('bluebird');

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
	let submissionsData = {
		total: undefined,
		solved: undefined,
		failed: undefined,
		successRate: undefined,
		usersWhoAttempted: undefined,
		usersWhoSolved: undefined,
		usersWhoSolvedMany: undefined,
		usersWhoSolvedWeekly: undefined
	};

	let queryTimeframe = '';
	if (req.query.start && req.query.end) {
		queryTimeframe = `WHERE submitted between '${req.query.start}' AND '${req.query.end}'`;
	}

	const queryTotal = `SELECT COUNT(*) as 'TOTAL' FROM ctflearn.submissions ${queryTimeframe};`,
		querySolved = `SELECT COUNT(*) as 'SOLVED' FROM ctflearn.submissions ${queryTimeframe} AND correct = 1;`,
		queryUsersAttempted = `SELECT COUNT(DISTINCT user_id) as 'USERS_ATTEMPTED' FROM ctflearn.submissions ${queryTimeframe};`,
		queryUsersSolved = `SELECT COUNT(DISTINCT user_id) as 'USERS_SOLVED' FROM ctflearn.submissions ${queryTimeframe} AND correct = 1;`,
		queryUsersSolvedMany = `SELECT COUNT(*) as 'USERS_SOLVED_MANY' FROM (SELECT COUNT(user_id) FROM ctflearn.submissions ${queryTimeframe} AND correct = 1 GROUP BY user_id HAVING COUNT(user_id) > 9) AS TENPLUSSOLVES;`,
		queryUsersSolvedWeekly = `SELECT COUNT(*) as 'USERS_SOLVED_WEEKLY' FROM (SELECT COUNT(user_id) FROM ctflearn.submissions ${queryTimeframe} AND correct = 1 GROUP BY user_id HAVING COUNT(user_id) > 3) AS FOURPLUSSOLVES;`;
	// queryUsersSolvedMany = `SELECT COUNT(*) FROM (SELECT COUNT(user_id) as 'USERS_SOLVED_MANY' FROM ctflearn.submissions WHERE correct = 1 HAVING COUNT(user_id) > 10) as colume;`;

	const query = `${queryTotal} ${querySolved} ${queryUsersAttempted} ${queryUsersSolved} ${queryUsersSolvedMany} ${queryUsersSolvedWeekly}`;

	// SELECT count(*) FROM ctflearn.submissions where submitted between DATE_SUB(NOW(), INTERVAL 14 DAY) and NOW();
	// ```select count(distinct user_id) from submissions where submitted between DATE_SUB(NOW(), INTERVAL 14 DAY) and NOW();```

	connection.query(query, (error, results, fields) => {
		if (error) throw error;

		console.log(results);
		// console.log(results[0][0]['TOTAL']);
		// console.log(results[1][0]['SOLVED']);

		submissionsData.total = results[0][0]['TOTAL'];
		submissionsData.solved = results[1][0]['SOLVED'];
		submissionsData.failed = submissionsData.total - submissionsData.solved;
		submissionsData.successRate = (submissionsData.solved / submissionsData.total) * 100;
		submissionsData.usersWhoAttempted = results[2][0]['USERS_ATTEMPTED'];
		submissionsData.usersWhoSolved = results[3][0]['USERS_SOLVED'];
		submissionsData.usersWhoSolvedMany = results[4][0]['USERS_SOLVED_MANY'];
		submissionsData.usersWhoSolvedWeekly = results[5][0]['USERS_SOLVED_WEEKLY'];

		console.log(submissionsData);
		res.send(submissionsData);
	});
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
