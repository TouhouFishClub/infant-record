const express = require('express');
const Db = require('../connectDb')
const router = express.Router();
const fs = require('fs-extra')
const path = require('path-extra')
const multer = require('multer')

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

/**
 * @api {get} /api/fetch 1. 获取信息
 * @apiVersion 0.0.1
 * @apiName 1. 获取信息
 * @apiGroup 通用接口/获取数据
 */
router.get('/fetch', async (req, res) => {
	let { _id } = req.query
	if(!_id) {
		res.send({
			status: 'err',
			message: '没有id'
		})
		return
	}

	let data = await client.db('db_baby').collection('cl_baby_info').find({}).toArray()

	if(data.length < 1) {
		res.send({
			status: 'err',
			message: '未查询到任何数据'
		})
		return
	}

	res.send({
		status: 'ok',
		message: data,
	})
})

/**
 * @api {post} /api/update 2. 修改信息
 * @apiVersion 0.0.1
 * @apiName 2. 修改信息
 * @apiGroup 通用接口/修改数据
 *
 * @apiParam {Object} Object （body）修改内容，与存储数据一致，必须包含_id
 *
 */
router.post('/update', async (req, res) => {
	let data = req.body
	if(!data._id) {
		res.send({
			status: 'err',
			message: '没有id'
		})
		return
	}
	await client.db('db_baby').collection('cl_baby_info').updateOne(
		{'_id': data._id},
		{'$set': data}
	)
	res.send({
		status: 'ok'
	})
})

/**
 * @api {post} /api/add 3. 增加信息
 * @apiVersion 0.0.1
 * @apiName 3. 增加信息
 * @apiGroup 通用接口/修改数据
 *
 * @apiParam {Object} Object （body）修改内容，与存储数据一致，必须包含_id
 *
 */
router.post('/add', async (req, res) => {
	let data = req.body
	if(!data._id) {
		res.send({
			status: 'err',
			message: '没有id'
		})
		return
	}
	await client.db('db_baby').collection('cl_baby_info').save(data)
	res.send({
		status: 'ok'
	})
})

/**
 * @api {get} /api/remove 4. 删除信息
 * @apiVersion 0.0.1
 * @apiName 4. 删除信息
 * @apiGroup 通用接口/修改数据
 *
 * @apiParam {Number} _id （body）条目id
 *
 */
router.post('/remove', async (req, res) => {
	let { _id } = req.query
	if(!_id) {
		res.send({
			status: 'err',
			message: '没有id'
		})
		return
	}
	let data = req.body
	delete data._id
	await client.db('db_baby').collection('cl_baby_info').remove({'_id': _id})
	res.send({
		status: 'ok'
	})
})



module.exports = router;
