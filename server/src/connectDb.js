const MongoClient = require('mongodb').MongoClient
const MONGO_URL = 'mongodb://127.0.0.1:27017/'

let client

const connectClient = cl =>
	new Promise((resolve, reject) => {
		MongoClient.connect(MONGO_URL, (err, db) => {
			if (err) {
				console.log('===== reject error =====')
				reject('err')
				throw err
			}
			console.log('===== CONNECT DB SUCCESS =====')
			if(!cl) {
				client = db
			}
			resolve(db)
		});
	})

const closeConnect = cl => {
	if(cl && checkClient(cl)) {
		cl.close()
	}
	if(checkClient(client)) {
		client.close()
	}
}

const checkClient = cl => {
	return cl ? cl.isConnected() : (client && client.isConnected())
}

const getClient = () => {
	return client
}

const saveDb = async (allDatas, database, cl) => {
	if(checkClient(client)){
		let dbo = client.db(database), collection = dbo.collection(cl)
		for(let i = 0; i < allDatas.length; i ++) {
			await collection.save(allDatas[i])
		}
		console.log('===== 保存完毕 =====')
	} else {
		console.log('===== [CONNECT ERROR] 数据库未链接 =====')
	}
	return true
}

module.exports = {
	connectClient,
	closeConnect,
	checkClient,
	getClient,
	saveDb,
}