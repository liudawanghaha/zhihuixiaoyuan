// 基础数据仓库
import axios from '../axios';
import qs from 'qs';
export default{
	state:{
		grades:[],
		teachers:[],
		courses:[],
		clazzes:[],
		schools:{},
	},
	getters:{
		grades:state=>{
			return state.grades.filter(function(item){
				return item.schoolId==3;
			});
		},
		teachers:state=>state.teachers,
		clazzes:state=>{
			return state.clazzes.filter(function(item){
				if(item.grade){
					return item.grade.schoolId==3;
				}else{
					return false;
				}
				
			});
		},
		courses:state=>state.courses,
		schools:state=>state.schools,
	},
	mutations:{
		changeGrades(state,data){
			// data是载荷
			state.grades=data;
		},
		changeTeachers(state,data){
			// data是载荷
			state.teachers=data;
		},
		changeCourses(state,data){
			state.courses=data;
		},
		changeClazzes(state,data){
			state.clazzes=data;
		},
		changeSchools(state,data){
			state.schools=data;
		},
	},
	actions:{
		// 年级操作
		// 批量删除年级
		batchGrade(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.get('/grade/batchDelete',{params:obj}).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
				});
			});
		},
		// 单个删除年级
		deleteGradeById(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.get('/grade/deleteById',{params:obj}).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 保存年级信息
		saveOneGrade(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.post('/grade/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 所有年级信息
		findAllGrade(context){
			return new Promise((resolve,reject)=>{
				axios.get('/grade/findAll').then(({data})=>{
					// data就是后台返回的所有数据
					// console.log(data.data);
					context.commit('changeGrades',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},

		// 教师操作
		// 批量删除教师
		batchTeacher(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.post('/user/batchDelete',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
				});
			});
		},
		// 单个删除教师
		deleteTeacherById(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.get('/user/deleteById',{params:obj}).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 保存教师信息
		saveOneTeacher(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.post('/user/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 所有教师信息
		findAllTeacher(context){
			return new Promise((resolve,reject)=>{
				axios.get('/user/findAll').then(({data})=>{
					// data就是后台返回的所有数据
					// console.log(data.data);
					context.commit('changeTeachers',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},

		// 班级操作
		// 批量删除班级
		batchClazz(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.post('/clazz/batchDeleteClazz',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
				});
			});
		},
		// 单个删除班级
		deleteClazzById(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.get('/clazz/deleteClazzById',{params:obj}).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 保存班级信息
		saveOneClazz(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.post('/clazz/saveOrUpdateClazz',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 所有班级信息
		findAllClazz(context){
			return new Promise((resolve,reject)=>{
				axios.get('/clazz/findAllVM').then(({data})=>{
					// data就是后台返回的所有数据
					// console.log(data.data);
					context.commit('changeClazzes',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},

		// 课程操作
		// 找到课程
		findAllCourse(context){
			return new Promise((resolve,reject)=>{
				axios.get('/course/findAllCourse').then(({data})=>{
					// data就是后台返回的所有数据
					// console.log(data.data);
					context.commit('changeCourses',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 批量删除课程
		batchCourse(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.post('/course/batchDelete',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
				});
			});
		},
		// 单个删除课程
		deleteCourseById(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.get('/course/deleteById',{params:obj}).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
		// 保存课程信息
		saveOneCourse(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.post('/course/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},

		// 学校操作
		// 查找
		findSchool(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/school/findById',{params:obj}).then(({data})=>{
					// data就是后台返回的所有数据
					// console.log(data.data);
					context.commit('changeSchools',data.data);
					resolve(data.data);
					// console.log('liudawang:'+JSON.stringify(data.data));
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 保存
		saveOneSchool(context,obj){
			return new Promise((resolve,reject)=>{
				// axios.post('/manager/category/saveOrUpdateCategory',obj);
				axios.post('/school/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					resolve(data)}).catch((error)=>{
						reject(error);
					});
			});
		},
	}
}