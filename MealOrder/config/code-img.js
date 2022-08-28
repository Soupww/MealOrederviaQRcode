// 给二进制图片重新命名786987.jpg
let Code = function(){
	var orderCode = ''
	for (var i = 0; i < 6; i++){
		orderCode += Math.floor(Math.random() * 10)
	}
	// 时间戳+orderCode
	orderCode = new Date().getTime() + orderCode
	return orderCode + '.jpg'
}

module.exports = {Code}