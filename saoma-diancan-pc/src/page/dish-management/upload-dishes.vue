<template>
	<div class="ordering">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/dishes' }">菜品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>添加菜品</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="content-view-ten" v-loading.fullscreen.lock="loadmen">
			<!-- 户型 -->
			<div class="image-view-title">
				<div class="image-list">菜品类目</div>
				<div>
					<el-select v-model="catevalue" placeholder="请选择菜品类目">
					    <el-option
					      v-for="item in category"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</div>
			</div>
			<!-- 面积 -->
			<div class="image-view-title">
				<div class="image-list">菜品名称</div>
				<el-input v-model="name" type="text" placeholder="请输入菜品名称" :clearable="true"></el-input>
			</div>
			<div class="image-view-title">
				<div class="image-list">菜品价格(元)</div>
				<div class="upload-option">
					<el-input v-model="price" min="0" type="number" placeholder="请输入菜品价格" :clearable="true"></el-input>
					<el-select v-model="compvalue" placeholder="请选择菜品单位">
					    <el-option
					      v-for="item in company"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
					<!-- 自定义单位 -->
					<el-input v-if="compvalue == '自定义单位'" type="text" v-model="unit" placeholder="请输入自定义单位" :clearable="true"></el-input>
					<div v-if="compvalue == '自定义单位'" style="margin-right: 0 !important;"><el-button type="success" size="medium" @click="dishunit()" :loading="unitload" :disabled="unitload" style="width: 100%;padding: 12px 20px;">添加自定义单位</el-button></div>
				</div>
			</div>
			<!-- 菜品图片 -->
			<div class="image-view-title">
				<div class="image-list">菜品图片</div>
				<div>
					<el-upload
					  :action="action"
					  list-type="picture-card"
					  name="file"
					  accept=".jpg,.png,.webp,.jfif,.jpeg"
					  :limit="1"
					  :on-remove="bannerRemove"
					  :on-success="bannerSuccess"
					  :on-preview="handlepreview"
					  :multiple="false"
					  :on-error="onErr"
					  :before-upload="project"
					  :file-list="goodsimage"
					  >
					  <i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
					  <img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>
			</div>
			<!-- 提交 -->
			<div class="image-button">
				<el-button type="success" size="medium" @click="bTn(but)" :loading="load" :disabled="load">{{but}}</el-button>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data() {
		return {
			loadmen: false,
			category:[],//菜品类目
			company:[],//菜品单位
			action:this.Urls.m().uploadres,
			load:false,
			unitload:false,//自定义单位按钮
			catevalue:'',//选中的菜品类目
			name:'',
			price:'',
			compvalue:'',//选中的菜品单位
			goodsimage:[],//商品图片
			unit:'',//自定义的单位
			but:'上架菜品',
			// 图片展开大图
			dialogImageUrl: '',
			dialogVisible: false,
			pagenum:0,
			custom:false,
			id:'',//该条数据的id，用于编辑
		}
	},
	methods:{
		// 上传图片展开大图
		handlepreview(file) {
		  this.dialogImageUrl = file.url;
		  this.dialogVisible = true;
		},
		// 上传失败
		onErr(e){
			this.loadmen = false
			this.$message.error('上传失败,尝试重新上传');
		},
		// 上传时
		project(file){
			this.loadmen = true
		},
		// 封面图移除文件时的钩子
		bannerRemove(file, fileList) {
		  this.goodsimage = []
		},
		// 上传成功：封面图
		bannerSuccess(res, file, fileList){
			this.goodsimage.push({url:res.data,uid:file.uid})
			this.loadmen = false
		},
		// 获取菜品类目和单位
		async obtaincate(){
			let incate = new this.Request(this.Urls.m().obtaincate + '?page=' + this.pagenum).modeget()
			let inunit = new this.Request(this.Urls.m().obtainunit).modeget()
			Promise.all([incate,inunit])
			.then(res=>{
				this.category = res[0].data.data.result
				this.company = res[1].data.data
				this.company.push({label:'自定义单位',value:'自定义单位',_id:'980',unid:'980'})
			})
			.catch(err=>{
				console.log(err)
			})
		},
		// 添加自定义单位
		async dishunit(){
			this.unitload = true
			let obj = {unit:this.unit}
			try{
				let res = await new this.Request(this.Urls.m().dishunit,this.$qs.stringify(obj)).modepost()
				if(res.status != 200){
					new this.mytitle(this.$message,'warning',res.data.msg).funtitle()
				}else{
					new this.mytitle(this.$message,'success',res.data.msg).funtitle()
					this.compvalue = ''
					this.unit = ''
					this.obtaincate()
				}
				this.unitload = false
			}catch(e){
				this.unitload = false
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		},
		bTn(is){
			this.load = true
			let cate = this.category.filter((item,index)=>{return item.value == this.catevalue})
			let category = cate.length == 0 ? '' : cate[0].cid
			// let unit = comp.length == 0 ? '' : comp[0].label == '自定义单位' ? '' : comp[0].label
			const obj = {
				id:this.id,
				category:this.catevalue,
				name:this.name,
				unitprice:this.price,
				unit:this.compvalue == '自定义单位' ? '' : this.compvalue,
				image:JSON.stringify(this.goodsimage),
				value:category//该分类下的cid
			}
			if(is == '上架菜品'){
				this.purequest(obj,is,this.Urls.m().uploaddishes)
			}else{
				// 提交修改
				this.purequest(obj,is,this.Urls.m().modifydishes)
			}
		},
		// 提交或修改公用请求
		async purequest(obj,is,url){
			try{
				const res = await new this.Request(url,this.$qs.stringify(obj)).modepost()
				if(res.status != 200){
					new this.mytitle(this.$message,'warning',res.data.msg).funtitle()
				}else{
					new this.mytitle(this.$message,'success',res.data.msg).funtitle()
					this.$router.push({name:'dishes'})
				}
				this.load = false
			}catch(e){
				this.load = false
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		}
	},
	// 获取菜品类目和菜品单位
	created() {
		let res = this.$route.params//接收上个页面传来的值
		console.log(res)
		this.obtaincate()
		// 编辑传来的数据
		if(JSON.stringify(res) != "{}"){
			this.but = '修改提交'
			this.id = res.item._id,
			this.catevalue = res.item.category,
			this.name = res.item.name,
			this.price = res.item.unitprice,
			this.compvalue = res.item.unit,
			this.goodsimage = res.item.image
		}
	},
}
</script>

<style scoped="scoped">
@import url("../../../style/overall.css");
.upload-option{
	display: flex;
	align-items: center;
	justify-content: left;
}
.upload-option div{width: 25% !important; margin-right: 5px;}
.el-button--success{width: 150px;}
</style>
