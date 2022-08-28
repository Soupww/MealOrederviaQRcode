const multer = require('@koa/multer')
const COS = require('cos-nodejs-sdk-v5');

var cos = new COS({
	SecretId:'AKIDUnrgFYbQ0KODn8D2e2B3g3B4lGYcRjnb',
	SecretKey:'c2EBtMceR2OYVEtKVQ7ZlhOq2y10nLh6',
	Protocol:'https:'
});

let Bucket = 'mealorder-1313431174'
let Region = 'ap-guangzhou'

let cosfun = function(filename, path){
	return new Promise((resolve, reject)=>{
		cos.uploadFile({
			Bucket,
			Region,
			Key:'diancan/' + filename,
			FilePath: path,
		})
		.then(res=>{
			resolve(res.Location)
		})
		.catch(err=>{
			reject(err)
		})
	})
}
// 二进制上传
let buffer = function(filename,path){
	return new Promise((resolve,reject)=>{
		cos.putObject({
			Bucket,
			Region,
			Key: 'diancan/' + filename,              /* 必须 */
			Body: Buffer.from(path),  
		})
		.then(res=>{
			resolve(res.Location)
		})
		.catch(err=>{
			reject(err)
		})
	})
}

//配置上传文件1.所在的目录和2.更改文件名
const storage = multer.diskStorage({
	destination:(req, file, cb)=>{
		cb(null,'upload/image')
	},
	filename:(req, file, cb)=>{
		let fileFormat = (file.originalname).split(".")
		let num = `${Date.now()}-${Math.floor(Math.random(0,1) * 10000000)}${"."}${fileFormat[fileFormat.length - 1]}`
		cb(null, num)
	}
})

const upload = multer({storage})
module.exports = {upload, cosfun,buffer}