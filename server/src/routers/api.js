const express = require('express');
const Db = require('../connectDb')
const router = express.Router();
const platform = require('../platform')()
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
	let { pid } = req.query
	if(pid) {
		if(platform[pid]) {
			next()
		} else {
			res.send({
				status: 'err',
				message: '没有相应机构'
			})
		}
	} else {
		res.send({
			status: 'err',
			message: '必须有机构id'
		})
	}
})

/**
 * @api {get} /api/fetch 1. 获取信息
 * @apiVersion 0.0.1
 * @apiName 1. 获取信息
 * @apiGroup 通用接口/获取数据
 *
 * @apiSuccess {Object} object 题目详情，与数据库存储一致
 */
router.get('/fetch', async (req, res) => {
	if(!_id) {
		res.send({
			status: 'err',
			message: '没有id'
		})
		return
	}

	let data = await client.db('db_question').collection(platform[pid].collection).findOne({'_id': parseInt(_id)}) || {}

	// console.log(_id)
	// console.log(typeof _id)
	// console.log(data)

	res.send({
		status: 'ok',
		message: data,
	})
})

/**
 * @api {post} /api/uni/fetch 1. 修改题目详情
 * @apiVersion 0.0.1
 * @apiName 1. 修改题目详情
 * @apiGroup 通用接口/修改数据
 *
 * @apiParam {String} pid （query）机构id
 * @apiParam {Object} Object （body）修改内容，与题目详情需一致，必须包含_id
 *
 */
router.post('/update', async (req, res) => {
	let { _id } =  req.body
	let { pid } = req.query
	if(!_id) {
		res.send({
			status: 'err',
			message: '没有id'
		})
		return
	}
	let data = req.body
	delete data._id
	await client.db('db_question').collection(platform[pid].collection).updateOne(
		{'_id': parseInt(_id)},
		{'$set': data}
	)
	res.send({
		status: 'ok'
	})
})



module.exports = router;
