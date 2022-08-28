//公共参数校验
const result = require('./handle.js')

class checking{
	constructor(ctx, ...obj){//..obj接收不固定参数
		this.ctx = ctx
		this.obj = obj
		//console.log(obj)//[ '13333333', '2222222' ]
	}
	
	//校验前端传来的值为undefined
	Errunder(){
		let bvc = this.obj.indexOf(undefined)//合法-1，非法0
		//console.log(bvc)
		if(bvc != -1){
			throw new result('参数填写错误', 400)
		}
	}
	//校验手机号码与密码格式
	Phone(mobile,num){
		let phone = /^1[3456789]\d{9}$/
		if(!phone.test(this.obj[num])){
			throw new result(mobile, 202)
		}
	}
	//密码校验：6-20位数字和字母结合
	Password(pass, num){
		let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
		if(!reg.test(this.obj[num])){
			throw new result(pass, 202)
		}
	}
	//校验空数组（上传图片）
	Arrfun(list, num){
		if(JSON.parse(this.obj[num]).length === 0){
			throw new result(list, 202)
		}
	}
	//校验为空
	Parameter(list){
		let bvc = this.obj.indexOf('')//合法-1，非法0
		if(bvc != -1){
			throw new result(list[bvc], 202)
		}
	}
	
	//空格符校验
	Blank(list){
		let vbn = this.obj.filter(item=>{
			return item.split(" ").join("").length === 0
			
		})
		let bvc = this.obj.indexOf(vbn[0])
		if(bvc != -1){
			throw new result(list[bvc],202)
		}
	}
}

//注册校验
class regcheck extends checking{
	start(){
		super.Errunder()
		super.Phone('请填写正确的手机号码', 0)
		super.Password('密码必须由6-20位数字字母组合', 1)
		
	}
}

//商家信息上传校验
class shopinfor extends checking{
	start(){
		let arr = ['请输入店铺名称','请输入店铺地址','请上传店铺图片']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
		super.Arrfun('请上传店铺图片',2)
		
	}
}

//类目上传校验
class catecheck extends checking{
	start(){
		let arr = ['请输入菜品类目']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
	}
}

//添加菜品单位校验
class unitcheck extends checking{
	start(){
		let arr = ['请输入自定义单位']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
	}
}

//上架菜品校验
class putoncheck extends checking{
		start(){
			let arr = ['请选择菜品类目','请输入菜品名称','请输入菜品价格','请选择菜品单位','请上传菜品图片','请上传所属类目的cid']
			super.Errunder()
			super.Parameter(arr)
			super.Blank(arr)
			super.Arrfun('请上传菜品图片',4)
		}
}

//添加桌号
class postcode extends checking{
	start(){
		let arr = ['桌号不能为空']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
	}
}

module.exports = {regcheck,shopinfor,catecheck,unitcheck,putoncheck,postcode}