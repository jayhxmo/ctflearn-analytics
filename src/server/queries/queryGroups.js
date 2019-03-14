const queryGroups = (req, res, connection) => {
	let groupsData = {
		total: undefined,
		month: undefined,
		team: undefined,
		teamMonth: undefined,
		community: undefined,
		communityMonth: undefined
	};

	let queryTimeframe = '';
	if (req.query.start && req.query.end) {
		queryTimeframe = `WHERE created between '${req.query.start}' AND '${req.query.end}'`;
	}

	const queryTotal = `SELECT COUNT(*) as 'TOTAL' FROM ctflearn.groups;`,
		queryMonth = `SELECT COUNT(*) as 'MONTH' FROM ctflearn.groups ${queryTimeframe};`,
		queryTeam = `SELECT COUNT(*) AS 'TEAM' FROM (SELECT ctflearn.groups.id FROM ctflearn.users INNER JOIN ctflearn.groups ON ctflearn.users.id = ctflearn.groups.owner_id INNER JOIN ctflearn.user_group_association ON ctflearn.groups.id = ctflearn.user_group_association.group_id GROUP BY ctflearn.groups.id HAVING COUNT(ctflearn.groups.id) > 2) AS TEAMLIST;`,
		queryTeamMonth = `SELECT COUNT(*) AS 'TEAM_MONTH' FROM (SELECT ctflearn.groups.id FROM ctflearn.users INNER JOIN ctflearn.groups ON ctflearn.users.id = ctflearn.groups.owner_id INNER JOIN ctflearn.user_group_association ON ctflearn.groups.id = ctflearn.user_group_association.group_id ${queryTimeframe} GROUP BY ctflearn.groups.id HAVING COUNT(ctflearn.groups.id) > 2) AS TEAMLIST;`,
		queryCommunity = `SELECT COUNT(*) AS 'COMMUNITY' FROM (SELECT ctflearn.groups.id FROM ctflearn.users INNER JOIN ctflearn.groups ON ctflearn.users.id = ctflearn.groups.owner_id INNER JOIN ctflearn.user_group_association ON ctflearn.groups.id = ctflearn.user_group_association.group_id GROUP BY ctflearn.groups.id HAVING COUNT(ctflearn.groups.id) > 9) AS COMMUNITYLIST;`,
		queryCommunityMonth = `SELECT COUNT(*) AS 'COMMUNITY_MONTH' FROM (SELECT ctflearn.groups.id FROM ctflearn.users INNER JOIN ctflearn.groups ON ctflearn.users.id = ctflearn.groups.owner_id INNER JOIN ctflearn.user_group_association ON ctflearn.groups.id = ctflearn.user_group_association.group_id ${queryTimeframe} GROUP BY ctflearn.groups.id HAVING COUNT(ctflearn.groups.id) > 9) AS COMMUNITYLIST;`;

	const query = `${queryTotal} ${queryMonth} ${queryTeam} ${queryTeamMonth} ${queryCommunity} ${queryCommunityMonth}`;

	connection.query(query, (error, results, fields) => {
		if (error) throw error;

		console.log(results);

		groupsData.total = results[0][0]['TOTAL'];
		groupsData.month = results[1][0]['MONTH'];
		groupsData.team = results[2][0]['TEAM'];
		groupsData.teamMonth = results[3][0]['TEAM_MONTH'];
		groupsData.community = results[4][0]['COMMUNITY'];
		groupsData.communityMonth = results[5][0]['COMMUNITY_MONTH'];

		console.log(groupsData);
		res.send(groupsData);
	});
};

module.exports = queryGroups;
