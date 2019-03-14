const querySubmissions = (req, res, connection) => {
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

	const query = `${queryTotal} ${querySolved} ${queryUsersAttempted} ${queryUsersSolved} ${queryUsersSolvedMany} ${queryUsersSolvedWeekly}`;

	connection.query(query, (error, results, fields) => {
		if (error) throw error;

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
};

module.exports = querySubmissions;
