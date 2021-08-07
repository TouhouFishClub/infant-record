const express = require('express');
const router = express.Router();
const Db = require('../connectDb');
const crypto = require('crypto');
const { sessionManager, setSession } = require('../session.manager')


let client

const checkConnect = () => new Promise((resolve, reject) => {
	if(Db.checkClient()) {
		if(!client) {
			client = Db.getClient()
		}
		resolve(Db.getClient())
	} else {
		Db.connectClient().then(db => {
			client = db
			resolve(db)
		})
	}
})

router.use(async (req, res, next) => {
	await checkConnect()
	next()
})


const loginHandler = async (req, res, params) => {
	let { username, password, captcha } = params
	if(!username) {
		res.send({
			status: 'err',
			message: '需要用户名'
		})
		return
	}
	if(!password) {
		res.send({
			status: 'err',
			message: '需要密码'
		})
		return
	}



	/*
	if(captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
		res.send({
			status: 'err_captcha',
			message: '验证码不正确'
		})
		return
	}
	*/


	let data = await client.db('db_baby').collection('cl_user').findOne({'username': `${username}`}) || {}
	if(data.username) {
		if(data.password == crypto.createHash('md5').update(password).digest('hex').toLowerCase()){
			setSession(data._id, data, req)
			res.send({
				status: 'ok',
				message: '登录成功'
			})
		} else {
			res.send({
				status: 'err',
				message: '密码错误'
			})
		}
	} else {
		res.send({
			status: 'err',
			message: '没有此用户'
		})
	}
}

const registerHandler = async (req, res, params) => {
	let { username, password, passwordConfirm, captcha } = params
	if(!username) {
		res.send({
			status: 'err',
			message: '需要用户名'
		})
		return
	}
	if(!password) {
		res.send({
			status: 'err',
			message: '需要密码'
		})
		return
	}
	if(password != passwordConfirm) {
		res.send({
			status: 'err',
			message: '两次密码不一致'
		})
		return
	}
	if(!captcha) {
		res.send({
			status: 'err',
			message: '需要验证码'
		})
		return
	}

	if(captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
		res.send({
			status: 'err_captcha',
			message: '验证码不正确'
		})
		return
	}

	let data = await client.db('db_baby').collection('cl_user').findOne({'username': `${username}`}) || null
	if(data) {
		res.send({
			status: 'err',
			message: '用户已存在'
		})
		return
	}

	await client.db('db_baby').collection('cl_user').save({
		'username': username,
		'password': crypto.createHash('md5').update(password).digest('hex').toLowerCase(),
	})

	res.send({
		status: 'ok',
		message: '注册成功'
	})
}

/**
 * @api {get} /user/login 1. 登录
 * @apiVersion 0.0.1
 * @apiName 1. 登录
 * @apiGroup 通用接口/用户
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiParam {String} captcha 图片验证码
 *
 *
 */
router.get('/login', async (req, res) => {
	loginHandler(req, res, req.query)
})
router.post('/login', async (req, res) => {
	loginHandler(req, res, req.body)
})


/**
 * @api {get} /user/register 2. 注册
 * @apiVersion 0.0.1
 * @apiName 2. 注册
 * @apiGroup 通用接口/用户
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiParam {String} passwordConfirm 重复密码
 * @apiParam {String} captcha 图片验证码
 *
 *
 */
router.get('/register', async (req, res) => {
	registerHandler(req, res, req.query)
})
router.post('/register', async (req, res) => {
	registerHandler(req, res, req.body)
})

module.exports = router;
