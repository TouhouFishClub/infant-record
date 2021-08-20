const express = require('express');
const Db = require('../connectDb')
const router = express.Router();
const fs = require('fs-extra')
const path = require('path-extra')
const multer = require('multer')
const ObjectId = require('mongodb').ObjectID;

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

router.post('/test', async (req, res) => {
	res.send({
		message: 'test',
		status: 'ok'
	})
})

/**
 * @api {get} /api/fetch 1. 获取信息
 * @apiVersion 0.0.1
 * @apiName 1. 获取信息
 * @apiGroup 通用接口/获取数据
 */
router.get('/fetch', async (req, res) => {

	let data = await client.db('db_baby').collection('cl_baby_info').find({'username': req.session.user.username}).sort({'_id':-1}).toArray()

	if(data.length < 1) {
		res.send({
			status: 'err_empty',
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
	data.username = req.session.user.username
	if(!data._id){
      data._id=data.ts;
	}
	data.time = new Date(data.ts);
	console.log(data);
	await client.db('db_baby').collection('cl_baby_info').save(data)
	res.send({
		status: 'ok'
	})
})

/**
 * @api {post} /api/add 3. 增加信息 [废弃，使用update更新]
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
 * @api {post} /api/remove 4. 删除信息
 * @apiVersion 0.0.1
 * @apiName 4. 删除信息
 * @apiGroup 通用接口/修改数据
 *
 * @apiParam {Number} _id （body）条目id
 *
 */
router.post('/remove', async (req, res) => {
	let { _id } = req.body
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

/**
 * @api {get} /api/user 5. 获取用户信息
 * @apiVersion 0.0.1
 * @apiName 5. 获取用户信息
 * @apiGroup 通用接口/修改数据
 *
 */
router.get('/user', (req, res) => {
	let out = Object.assign({}, req.session.user)
	delete out.password
	res.send({
		message: out,
		status: 'ok'
	})
})

/**
 * @api {post} /api/setUserInfo 6. 设置用户信息
 * @apiVersion 0.0.1
 * @apiName 6. 设置用户信息
 * @apiGroup 通用接口/修改数据
 *
 */
router.post('/setUserInfo', async (req, res) => {
	let { _id } = req.session.user, data = req.body
	await client.db('db_baby').collection('cl_user').updateOne(
		{'_id': ObjectId(_id)},
		{'$set': data}
	)
	req.session.user = Object.assign(req.session.user, data)
	res.send({
		status: 'ok'
	})
})



/**
 * @api {post} /api/upload_img 7. 上传图片
 * @apiVersion 0.0.1
 * @apiName 7. 上传图片
 * @apiGroup 通用接口/修改数据
 *
 */

var UPLOAD_TMP_URL = path.join(__dirname, '..', '..', 'tmp_file');
fs.ensureDirSync(UPLOAD_TMP_URL)
var UPLOAD_URL = path.join(__dirname, '..', '..', 'file');
var upload = multer({dest: UPLOAD_TMP_URL});

router.post('/upload_img', upload.any(), (req, res, next) => {
	res.set("Access-Control-Allow-Origin", "*");
	console.log('============')
	console.log(req.body)
	console.log(req.files[0]);  // 上传的文件信息
	// 分析文件信息
	let { originalname } = req.files[0]
	let extname = path.extname(originalname)
	console.log(extname)

	let filename = `${Date.now()}${extname}`
	let user_dir = path.join(UPLOAD_URL, req.session.user.username)
	fs.ensureDirSync(user_dir)
	let des_file = path.join(user_dir, '.', filename)
	console.log(des_file);
	fs.readFile( req.files[0].path, (err, data) => {
		fs.writeFile(des_file, data, (err) => {
			if( err ){
				console.log('===== UPLOAD FILE ERROR =====')
				console.log( err );
			}else{
				response = {
					message:'File uploaded successfully',
					filename
				};
				console.log( response );
				res.end( JSON.stringify( response ) );
			}
		})
	})
})



router.get('/image', (req, res) => {
	let { d } = req.query,
		imgpath = path.join(__dirname, "..", '..', "file", req.session.user.username, d);




	// var querydata = req.query;
	// var url = querydata.url;
	// var imgpath = querydata.d;
	// imgpath = path.join(__dirname,"..","file", imgpath);
	//
	// var bface = querydata.bface;
	if(imgpath){
		// var head = '../coolq-data/cq/data/image';
		// var realpath = path.join(__dirname,head,imgpath);
		res.sendFile(imgpath);
	}else{
		request({
			url: url,
			method: "GET"
		}, function(error, response, body){
			if(error&&error.code){
				console.log('pipe error catched!')
				console.log(error);
			}
		}).pipe(res);
	}
});


module.exports = router;
