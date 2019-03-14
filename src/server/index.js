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
});

app.get('/api/users', (req, res) => {
	let usersData = {
		total: undefined,
		totalActivated: undefined,
		joinedPastMonth: undefined,
		activatedPastMonth: undefined,
		referredFromCTF: undefined,
		referredFromFriend: undefined,
		referredFromInternet: undefined,
		referredFromCommunity: undefined,
		referredOther: undefined,
		referredFromCTFPastMonth: undefined,
		referredFromFriendPastMonth: undefined,
		referredFromInternetPastMonth: undefined,
		referredFromCommunityPastMonth: undefined,
		referredOtherPastMonth: undefined
	};

	let queryTimeframe = '';
	if (req.query.start && req.query.end) {
		queryTimeframe = `WHERE joined between '${req.query.start}' AND '${req.query.end}'`;
	}

	const queryTotal = `SELECT COUNT(*) as 'TOTAL_JOINED' FROM ctflearn.users;`,
		queryTotalActivated = `SELECT COUNT(*) as 'TOTAL_ACTIVATED' FROM ctflearn.users WHERE confirmed = 1;`,
		queryJoinedMonth = `SELECT COUNT(*) as 'MONTH_JOINED' FROM ctflearn.users ${queryTimeframe};`,
		queryActivatedMonth = `SELECT COUNT(*) as 'MONTH_ACTIVATED' FROM ctflearn.users ${queryTimeframe} AND confirmed = 1;`,
		queryReferredFromCTF = `SELECT COUNT(*) as 'REFERRED_CTF' FROM ctflearn.users WHERE referral = 0;`,
		queryReferredFromFriend = `SELECT COUNT(*) as 'REFERRED_FRIEND' FROM ctflearn.users WHERE referral = 1;`,
		queryReferredFromInternet = `SELECT COUNT(*) as 'REFERRED_INTERNET' FROM ctflearn.users WHERE referral = 2;`,
		queryReferredFromCommunity = `SELECT COUNT(*) as 'REFERRED_COMMUNITY' FROM ctflearn.users WHERE referral = 3;`,
		queryReferredOther = `SELECT COUNT(*) as 'REFERRED_OTHER' FROM ctflearn.users WHERE referral = 4;`,
		queryReferredFromCTFMonth = `SELECT COUNT(*) as 'MONTH_REFERRED_CTF' FROM ctflearn.users ${queryTimeframe} AND referral = 0;`,
		queryReferredFromFriendMonth = `SELECT COUNT(*) as 'MONTH_REFERRED_FRIEND' FROM ctflearn.users ${queryTimeframe} AND referral = 1;`,
		queryReferredFromInternetMonth = `SELECT COUNT(*) as 'MONTH_REFERRED_INTERNET' FROM ctflearn.users ${queryTimeframe} AND referral = 2;`,
		queryReferredFromCommunityMonth = `SELECT COUNT(*) as 'MONTH_REFERRED_COMMUNITY' FROM ctflearn.users ${queryTimeframe} AND referral = 3;`,
		queryReferredOtherMonth = `SELECT COUNT(*) as 'MONTH_REFERRED_OTHER' FROM ctflearn.users ${queryTimeframe} AND referral = 4;`;

	const query = `${queryTotal} ${queryTotalActivated} ${queryJoinedMonth} ${queryActivatedMonth} ${queryReferredFromCTF} ${queryReferredFromFriend} ${queryReferredFromInternet} ${queryReferredFromCommunity} ${queryReferredOther} ${queryReferredFromCTFMonth} ${queryReferredFromFriendMonth} ${queryReferredFromInternetMonth} ${queryReferredFromCommunityMonth} ${queryReferredOtherMonth}`;

	connection.query(query, (error, results, fields) => {
		if (error) throw error;

		console.log(results);

		usersData.total = results[0][0]['TOTAL_JOINED'];
		usersData.totalActivated = results[1][0]['TOTAL_ACTIVATED'];
		usersData.joinedMonth = results[2][0]['MONTH_JOINED'];
		usersData.activatedMonth = results[3][0]['MONTH_ACTIVATED'];
		usersData.referredFromCTF = results[4][0]['REFERRED_CTF'];
		usersData.referredFromFriend = results[5][0]['REFERRED_FRIEND'];
		usersData.referredFromInternet = results[6][0]['REFERRED_INTERNET'];
		usersData.referredFromCommunity = results[7][0]['REFERRED_COMMUNITY'];
		usersData.referredOther = results[8][0]['REFERRED_OTHER'];
		usersData.referredFromCTFMonth = results[9][0]['MONTH_REFERRED_CTF'];
		usersData.referredFromFriendMonth = results[10][0]['MONTH_REFERRED_FRIEND'];
		usersData.referredFromInternetMonth = results[11][0]['MONTH_REFERRED_INTERNET'];
		usersData.referredFromCommunityMonth = results[12][0]['MONTH_REFERRED_COMMUNITY'];
		usersData.referredOtherPastMonth = results[13][0]['MONTH_REFERRED_OTHER'];

		console.log(usersData);
		res.send(usersData);
	});
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
