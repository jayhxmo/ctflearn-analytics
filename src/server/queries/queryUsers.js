const queryUsers = (req, res, connection) => {
	let usersData = {
		total: undefined,
		totalActivated: undefined,
		joinedMonth: undefined,
		activatedMonth: undefined,
		referredFromCTF: undefined,
		referredFromFriend: undefined,
		referredFromInternet: undefined,
		referredFromCommunity: undefined,
		referredOther: undefined,
		referredFromCTFMonth: undefined,
		referredFromFriendMonth: undefined,
		referredFromInternetMonth: undefined,
		referredFromCommunityMonth: undefined,
		referredOtherMonth: undefined
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
};

module.exports = queryUsers;
