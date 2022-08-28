<template>
<!-- 单个商品弹出 -->
<view class="details-back">
	<view class="goods-details coup-anim">
		<view class="goods-image">
			<image :src="pro_details.itemgood.image[0].url" mode="aspectFill"></image>
			<image src="/static/tab/guanbi.png" mode="widthFix" @click="cLose()"></image>
		</view>
		<view class="details-padd">
			<view class="details-name">{{pro_details.itemgood.name}}</view>
			<view class="details-Thinning">已售 {{pro_details.itemgood.monthlysale}}</view>
			<view class="describe">
				<view class="details-unit-price">
					<text>¥</text>
					<text>{{pro_details.itemgood.unitprice}}</text>
					<text>/{{pro_details.itemgood.unit}}</text>
				</view>
				<view class="details-quantity">
					<view><image v-if="pro_details.itemgood.quantity > 0" src="/static/tab/jianhao.png" @click="reduce(pro_details)"></image></view>
					<view><text v-if="pro_details.itemgood.quantity > 0">{{pro_details.itemgood.quantity}}</text></view>
					<view><image src="/static/tab/jia.png" @click="plus(pro_details)"></image></view>
				</view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
export default{
	props:{pro_details:Object},
	methods:{
		// 关闭弹窗
		cLose(){
			this.$parent.popup_item(false)
		},
		// -
		reduce(pro_details){
			let {index,good_index,cid,itemgood} = pro_details
			this.$parent.reduce(index,good_index,cid,itemgood)
		},
		// +
		plus(pro_details){
			let {index,good_index,cid,itemgood} = pro_details
			this.$parent.plus(index,good_index,cid,itemgood)
		}
	}
}
</script>

<style scoped>
@import '../../../style/shadow.css';
.goods-image{
	width: 100%;
	height: 500rpx;
	position: relative;
}
.goods-image image:nth-child(1){
	display: block;
	width: 100%;
	height: 500rpx;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
}
.goods-image image:nth-child(2){
	display: block;
	width: 50rpx;
	height: 50rpx;
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	border-radius: 50%;
}
.details-padd{
	padding: 20rpx 20rpx 0 20rpx;
}
.describe{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.details-quantity image{
	width: 50rpx;
	height: 50rpx;
	display: block;
}
.details-quantity{
	display: flex;
	align-items: center;
	width: 200rpx;
	justify-content: space-between;
}
.details-name{
	font-size: 35rpx;
	font-weight: bold;
}
.details-Thinning{
	font-size: 30rpx;
	color: #a4a4a4;
	padding: 20rpx 0;
}
.details-unit-price{
	font-size: 30rpx;
	color: #ec702d;
	display: flex;
	align-items: baseline;
}
.details-unit-price text:nth-child(2){
	font-size: 35rpx;
}
.details-unit-price text:nth-child(3){
	color: #999999 !important;
}
</style>
