// 问卷管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		questions:[],
		questionnaires:[],
		quesNoOption:[],
		naireWithQues:{},
	},
	getters:{
		questions:state=>state.questions,
		questionnaires:state=>state.questionnaires,
		quesNoOption:state=>state.quesNoOption,
		naireWithQues:state=>state.naireWithQues,
	},
	mutations:{
		changeQuestions(state,data){
			// data是载荷
			state.questions=data;
		},
		changeQuestionnaires(state,data){
			// data是载荷
			state.questionnaires=data;
		},
		changeQuesNoOption(state,data){
			state.quesNoOption=data;
		},
		changeNaireWithQues(state,data){
			state.naireWithQues = data;
		},
	},
	actions:{
		// 题目操作
		// 批量删除题目
		batchQuestion(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/question/batchDeleteQuestion',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
				});
			});
		},
		// 单个删除题目
		deleteQuestionById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/question/deleteQuestionById',{params:obj}).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 保存题目信息
		saveOneQuestion(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/question/saveOrUpdateQuestion',qs.stringify(obj,{allowDots: true})).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 所有题目信息
		findAllQuestions(context){
			return new Promise((resolve,reject)=>{
				axios.get('/question/findAllQuestionVM').then(({data})=>{
					// data就是后台返回的所有数据
					// console.log(data.data);
					context.commit('changeQuestions',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},

		// 问卷管理
		// 批量删除问卷
		batchQuestionnaire(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/questionnaire/batchDeleteQuestion',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
				});
			});
		},
		// 单个删除问卷
		deleteQuestionnaireById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/questionnaire/deleteQuestionnaireById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 保存问卷信息
		saveOneQuestionnaire(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/questionnaire/saveOrUpdateQuestionnaire',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 所有问卷信息
		findAllQuestionnaire(context){
			return new Promise((resolve,reject)=>{
				axios.get('/questionnaire/findAllQuestionnaire').then(({data})=>{
					// data就是后台返回的所有数据
					// console.log(data.data);
					context.commit('changeQuestionnaires',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 返回题目信息
		findAllQuesNoOption(context){
			// 返回题目id，类型，questionType
			return new Promise((resolve,reject)=>{
				axios.get('/question/findAllQuestion').then(({data})=>{
					// data就是后台返回的所有数据
					// console.log(data.data);
					context.commit('changeQuesNoOption',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findNaireWithQues(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/questionnaire/findQuestionnaireVMById',{params:obj}).then(({data})=>{
					context.commit('changeNaireWithQues',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	}
}