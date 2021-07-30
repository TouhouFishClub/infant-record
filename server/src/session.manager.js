const EXPIRE_TIME = 30 * 60 * 1000
let sessions = {}

const sessionManager = async (req, res, next) => {
	console.log('===== session =====')
	console.log(req.session)
	console.log(req.session && req.session.id)
	console.log('===== sessions =====')
	console.log(sessions)
	console.log('==========')
	next()
}

const setSession = (sid, user, req) => {
	if(sid) {
		req.session.sid = sid;
		req.session.user = user;
		sessions[sid] = {
			id: req.session.id,
			expires: Date.now() + EXPIRE_TIME
		};
	}
}

const checkSession = (req, res, next) => {
	if(req.session && req.session.sid && sessions[req.session.sid].id === req.session.id) {
		if(Date.now() > sessions[req.session.sid].expires) {
			// 如果超时，删除session
			delete req.session.sid && delete(sessions[req.session.sid]);
			res.status(401).send('Unauthorized');
		} else {
			// 如果在有效期内，更新expires
			sessions[req.session.sid].expires = Date.now() + EXPIRE_TIME
			next()
		}
	} else {
		res.status(401).send('Unauthorized');
	}
}

module.exports = {
	sessionManager,
	setSession,
	checkSession,
}
