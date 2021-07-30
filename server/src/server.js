const path = require('path-extra')
const express = require('express')
const bodyParser = require('body-parser')
const platform = require('./platform')()
const morgan = require('morgan')
const session = require('express-session');
const svgCaptcha = require('svg-captcha');
const cookieParser = require('cookie-parser');
const { sessionManager, checkSession } = require('./session.manager')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(morgan('[:date[web]] :method :url :status :response-time ms - :res[content-length]'))
app.use(cookieParser());

app.use(session({
	secret : 'secret', // 一个 String 类型的字符串，作为服务器端生成 session 的签名。
	resave : false, // 强制保存 session 即使它并没有变化
	saveUninitialized: true, // 强制将未初始化的 session 存储
	// rolling: true, // 在每次请求时强行设置 cookie，这将重置 cookie 过期时间
	// cookie : {
	// 	maxAge : 1000 * 60 * 30,
	// },
}));

// app.use(sessionManager)

// app.use('/media', express.static(path.join(__dirname, 'media'), {maxage: '2h'}))

app.use('/api', checkSession)

app.use('/doc', express.static(path.join(__dirname, '..', 'doc')))

app.get('/p/captcha', (req, res) => {
	let captcha = svgCaptcha.create();
	req.session.captcha = captcha.text;
	res.type('svg');
	res.status(200).send(captcha.data);
});

/**
 * @api {get} /api/getPlatforms 1. 获取所有机构
 * @apiVersion 0.0.1
 * @apiName 1. 获取所有机构
 * @apiGroup 获取机构
 *
 * @apiSuccess {String} id 机构id（pid）
 * @apiSuccess {String} label 机构名称
 * @apiSuccess {String} collection 数据库表名
 */
app.get('/api/getPlatforms', (req, res) => {
	res.send({
		status: 'ok',
		message: Object.values(platform),
	})
})

app.use('/p/a', require('./routers/user'))
app.use('/api/uni', require('./routers/api'))

app.listen(3000, () => { console.log('app listening on port 3000') })
