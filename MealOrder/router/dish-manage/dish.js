const result = require('../../config/result.js')
const {getToken,Addurl, Tripurl, Updateurl} = require('../../config/databaseapi.js')
//------登录-注册---接口---
const router = require('koa-router')()
const {shopinfor,catecheck,unitcheck,putoncheck} = require('../../config/checking.js')
const {Auth} = require('../../token/auth.js')
const {upload, cosfun} = require('../../cos/cos')
const moment = require('moment')
moment.locale('zh-cn')

//获取菜品单位
router.get('/obtainunit', new Auth().m, async ctx=>{
	const query = `db.collection('dishunit').get()`
	try{
		const res = await new getToken().posteve(Tripurl, query)
		const data = res.data.map(item=>{return JSON.parse(item)})
		new result(ctx, 'SUCCESS', 200, data).answer()
	}catch(e){
		new result(ctx, '服务器发生错误', 500).answer()
	}
})

//自定义添加菜品单位
router.post('/dishunit', new Auth().m, async ctx=>{
	const {unit} = ctx.request.body
	//校验
	new unitcheck(ctx, unit).start()
	const unid = new Date().getTime()
	//查询数据库是否已有
	const query = `db.collection('dishunit').where({label:'${unit}'}).get()`
	const cate = `db.collection('dishunit').add({data:{value:'${unit}',label:'${unit}',unid:'${unid}'}})`
	try{
		const res = await new getToken().posteve(Tripurl,query)
		console.log(res)
		if(res.data.length > 0){
			new result(ctx, '该单位已存在', 202).answer()
		}else{
			await new getToken().posteve(Addurl,cate)
			new result(ctx,'添加成功').answer()
		}
	}catch(e){
		
		new result(ctx,'添加失败,服务器发生错误', 500).answer()
	}
	
})

//上架菜品
router.post('/uploaddishes', new Auth().m, async ctx=>{
	const {id,category,name,unitprice,unit,image,value} = ctx.request.body
	//校验
	new putoncheck(ctx, category, name, unitprice, unit, image,value).start()
	let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
	let query = `db.collection('dishes-data').add({data:
	{
		category:'${category}', name:'${name}', unitprice:${unitprice}, unit:'${unit}',
		image:${image}, quantity:0, onsale:true, cid:'${value}',time:'${time}', monthlysale:0
	}
	})`
	//对当前类目下的count字段自增
	let count = `db.collection('dishes-category').where({cid:'${value}'}).update({data:{count:db.command.inc(1)}})`
	try{
		await new getToken().posteve(Addurl, query)
		await new getToken().posteve(Updateurl,count)
		new result(ctx, '提交成功').answer()
	}catch(e){
		new result(ctx, '提交失败,服务器发生错误', 500).answer()
	}
	
})


//获取菜品数据
router.get('/obtaindishes', new Auth().m, async ctx=>{
	let {page} = ctx.query
	let sk = page * 10
	const query = `db.collection('dishes-data').orderBy('time','desc').limit(10).skip(${sk}).get()`
	try{
		const res = await new getToken().posteve(Tripurl, query)
		const data = res.data.map(item=>{return JSON.parse(item)})
		const tatal = {tatal:res.pager.Total}
		const array = {...{result:data},...tatal}
		new result(ctx,'SUCCESS',200,array).answer()
		
	}catch(e){
		new result(ctx,'服务器发生错误',500).answer()
	}
})

//下架商品
router.get('/fromsale', new Auth().m, async ctx=>{
	const  {id,value} = ctx.query
	//修改该条菜品的onsale为false
	const query = `db.collection('dishes-data').doc('${id}').update({data:{onsale:false}})`
	//查询到在哪个类目下，将count字段自减
	let count = `db.collection('dishes-category').where({cid:'${value}'}).update({data:{count:db.command.inc(-1)}})`
	try{
		await new getToken().posteve(Updateurl,query)
		await new getToken().posteve(Updateurl,count)
		new result(ctx,'已下架').answer()
	}catch(e){
		new result(ctx, '服务器发生错误',500).answer()
	}
})

router.post('/modifydishes', new Auth().m, async ctx=>{
	const {id,category,name,unitprice,unit,image,value} = ctx.request.body
	//校验
	new putoncheck(ctx, category, name, unitprice, unit, image,value).start()
	let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
	let query = `db.collection('dishes-data').doc('${id}').update({data:
	{
		category:'${category}', name:'${name}', unitprice:${unitprice}, unit:'${unit}',
		image:${image}, quantity:0, onsale:true, cid:'${value}',time:'${time}'
	}
	})`
	try{
		await new getToken().posteve(Updateurl,query)
		new result(ctx,'修改成功').answer()
	}catch(e){
		new result(ctx,'修改失败，服务器发生错误',500).answer()
	}
})

module.exports = router.routes()