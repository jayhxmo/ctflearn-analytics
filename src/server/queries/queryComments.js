const queryComments = (req, res, connection) => {
	let commentsData = {
		total: undefined,
		month: undefined
	};

	let queryTimeframe = '';
	if (req.query.start && req.query.end) {
		queryTimeframe = `WHERE timestamp between '${req.query.start}' AND '${req.query.end}'`;
	}

	const queryTotal = `SELECT COUNT(*) as 'TOTAL' FROM ctflearn.comments;`,
		queryMonth = `SELECT COUNT(*) as 'MONTH' FROM ctflearn.comments ${queryTimeframe};`;

	const query = `${queryTotal} ${queryMonth}`;

	connection.query(query, (error, results, fields) => {
		if (error) throw error;

		commentsData.total = results[0][0]['TOTAL'];
		commentsData.month = results[1][0]['MONTH'];

		console.log(commentsData);
		res.send(commentsData);
	});
};

module.exports = queryComments;
