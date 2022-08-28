import App from './App'
import Vue from 'vue'
import GoEasy from 'goeasy'

import './style/animat.css'

// 时间模块
let moment = require('moment')
moment.locale('zh-cn')
Vue.prototype.$Time = moment

// 即时通讯：订单提醒
Vue.prototype.goeasy = GoEasy.getInstance({
    host:"hangzhou.goeasy.io",  //若是新加坡区域：singapore.goeasy.io
    appkey:"BC-99ef1318c1bc4f3885dcadb58828a0e6",
    modules:['pubsub']//根据需要，传入‘pubsub’或'im’，或数组方式同时传入
});


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()