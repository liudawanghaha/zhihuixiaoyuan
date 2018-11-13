// 课调管理仓库
import axios from '../axios';
import qs from 'qs';
import $ from 'jquery';
import Highcharts from 'highcharts';
export default {
	state:{
		surveies:[],
	},
	getters:{
		surveies:state=>state.surveies,
		// 获取所有审核通过的课调
		passSurvey:state=>{
			return state.surveies.filter((item)=>{
				return item.status=="审核通过";
			});
		},
	},
	mutations:{
		changeSurvey(state,data){
			// data是载荷
			state.surveies=data;
		},
	},
	actions:{
		// 课调管理
		batchSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/survey/batchDeleteSurveyById',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
				});
			});
		},
		// 单个删除课调
		deleteSurveyById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/deleteSurveyById',{params:obj}).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 保存课调信息
		saveOneSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/survey/saveOrUpdateSurvey',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 所有课调信息
		findAllSurvey(context){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/findAllSurveyVM').then(({data})=>{
					// data就是后台返回的所有数据
					// console.log(data.data);
					context.commit('changeSurvey',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},

		// 开启课调
		startSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/beginSurvey',{params:obj}).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 关闭课调
		stopSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/stopSurvey',{params:obj}).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 审核课调
		finalCheckSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/checkSurvey',{params:obj}).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
	}
}