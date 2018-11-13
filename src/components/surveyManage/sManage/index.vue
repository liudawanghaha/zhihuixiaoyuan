<!-- 课调管理页面 -->
<template>
  <div class="sManage">
  	<!-- {{surveies}} -->
  	<!-- {{surveyList}} -->
  	<!-- {{choice}} -->
    <div class="optionDiv">
    	<el-select v-model="choice.type" placeholder="请选择所属年级" clearable @change='typeChange'>
          <el-option v-for='(item,index) in typeArr' :key='index' :label="item.name" :value="item.value"></el-option>
      </el-select>
      <el-input v-model="choice.search" placeholder="请输入内容" clearable 
      :disabled='Boolean(choice.type?0:1)'></el-input>
      <el-button type="danger" @click='batchDelete'>批量删除</el-button>
      <el-button type="success" @click='add'>新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table :height='tableHeight' tooltip-effect="dark" :data='surveyList' style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align='center'></el-table-column>
        <el-table-column label="年级" prop='clazzVM.grade.name' align='center'></el-table-column>
        <el-table-column label="班级" prop='clazzVM.name' align='center'></el-table-column>
        <el-table-column label="课程" prop='course.name' align='center'></el-table-column>
        <el-table-column label="问卷" prop='qnVM.name' align='center'></el-table-column>
        <el-table-column label="讲师" prop='user.name' align='center'></el-table-column>
        <el-table-column label="课调时间" prop='surveydate' align='center'>
        	<template slot-scope='scope'>
        		<span>
        			{{scope.row.surveydate?scope.row.surveydate.split(' ')[0]:'----'}}
        		</span>
        	</template>
        </el-table-column>
        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
          	<i class="fa fa-eye" @click="handleEyes(scope.$index, scope.row)" title="预览" style="color:teal"></i>
            <i class="fa fa-pencil-square-o" @click="handleEdit(scope.$index, scope.row)" title="编辑" style="color:#717C0A"></i>
            <i class="fa fa-trash" @click="handleDelete(scope.$index, scope.row)" title="删除" style="color:#E79597"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
    	<!-- {{form}} -->
      <el-form :model="form">
        <el-form-item label="年级" :label-width="formLabelWidth">
          <el-select v-model="gradeId" placeholder="请选择年级" clearable  @change='gradeChange'>
	          <el-option v-for='(item,index) in grades' :key='index' :label="item.name" :value="item.id"></el-option>
	      	</el-select>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-select v-model="form.clazzId" placeholder="请选择班级" clearable :disabled='Boolean(gradeId?0:1)'>
	          <el-option v-for='(item,index) in clazzList' :key='index' :label="item.name" :value="item.id"></el-option>
	      	</el-select>
        </el-form-item>
        <el-form-item label="课程" :label-width="formLabelWidth">
          <el-select v-model="form.courseId" placeholder="请选择课程" clearable>
	          <el-option v-for='(item,index) in courses' :key='index' :label="item.name" :value="item.id"></el-option>
	      	</el-select>
        </el-form-item>
        <el-form-item label="讲师" :label-width="formLabelWidth">
          <el-select v-model="form.userId" placeholder="请选择讲师" clearable>
	          <el-option v-for='(item,index) in teachers' :key='index' :label="item.name" :value="item.id"></el-option>
	      	</el-select>
        </el-form-item>
        <el-form-item label="问卷" :label-width="formLabelWidth">
          <el-select v-model="form.questionnaireId" placeholder="请选择问卷" clearable>
	          <el-option v-for='(item,index) in questionnaires' :key='index' :label="item.name" :value="item.id"></el-option>
	      	</el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="currentSurvey.qnVM?currentSurvey.qnVM.name:''" :visible.sync="dialogEyeVisible">
      <!-- {{naireWithQues}} -->
      <table class="eyeTable">
      	<tr>
      		<td><span>班级：{{currentSurvey.clazzVM.name}}</span></td>
      		<td><span>讲师：{{currentSurvey.user.name}}</span></td>
      		<td><span>时间：{{currentSurvey.surveydate}}</span></td>
      		<td><span>课程：{{currentSurvey.course.name}}</span></td>
      	</tr>
      </table>
      <div class="contentDiv">
        <div class="itemDiv" v-for="(item,index) in currentSurvey.qnVM.questionVMs">
          <ul>
            <li>
              序号{{index+1}}:&nbsp;&nbsp;{{item.name}}
            </li>
            <li style="padding-left:30px;" v-for="(option,num) in item.options">
              {{option.label}}.&nbsp;{{option.name}}
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
export default {
  data(){
    return {
      choice:{
      	type:'',
      	search:'',
      },
      typeArr:[{
      	name:'年级',
      	value:'grade',
	      },{
	      	name:'班级',
	      	value:'clazz'
	      },{
	      	name:'课程',
	      	value:'course'
	      },{
	      	name:'讲师',
	      	value:'user'
	      },{
	      	name:'问卷',
	      	value:'qn'
	      }
	    ],
	    tableHeight:'300',
	    dialogFormVisible:false,
	    formLabelWidth:'80px',
	    form:{
	    	clazzId:'',
  			courseId:'',
  			userId:'',
  			questionnaireId:'',
	    },
	    dialogTitle:'新增',
	    gradeId:'',
	    // 当前要预览的课调对象的信息
	    currentSurvey:{
	    	qnVM:{},
	    	clazzVM:{},
	    	user:{},
	    	course:{},
	    	qnVM:{
	    		questionVMs:[]
	    	},
	    },
	    dialogEyeVisible:false,
    }
  },
  created(){
    this.findAllSurvey();
    // vue实例，属性和方法创建完毕
    this.tableHeight=$(window).height()-200;
    this.findAllGrade();
    this.findAllTeacher();
    this.findAllClazz();
    this.findAllCourse();
    this.findAllQuestionnaire();
  },
  mounted(){
  	// 设置元素的高度，渲染完毕后，选中
  	// vue实例与DOM树绑定并且渲染完毕
  },
  computed:{
  	surveyList(){
  		// 过滤条件是this.choice.type和this.choice.search
  		let vm=this;
			return vm.surveies.filter((item)=>{
				if(vm.choice.type){
					if(vm.choice.type=='grade'&&item.clazzVM.grade){
						// 如果对年级进行过滤，对年级进行过滤
						return item.clazzVM.grade.name.indexOf(vm.choice.search)!=-1;
					}else if(vm.choice.type=='clazz'&&item.clazzVM){
						// 如果对年级进行过滤，对年级进行过滤
						return item.clazzVM.name.indexOf(vm.choice.search)!=-1;
					}else if(vm.choice.type=='course'&&item.course){
						// 如果对年级进行过滤，对年级进行过滤
						return item.course.name.indexOf(vm.choice.search)!=-1;
					}else if(vm.choice.type=='user'&&item.user){
						// 如果对年级进行过滤，对年级进行过滤
						return item.user.name.indexOf(vm.choice.search)!=-1;
					}else if(vm.choice.type=='qn'&&item.qnVM){
						// 如果对年级进行过滤，对年级进行过滤
						return item.qnVM.name.indexOf(vm.choice.search)!=-1;
					}else{
						return false;
					}
				}else{
					return true;
				}
			})
  	},
  	clazzList(){
  		let vm=this;
  			return vm.clazzes.filter((item,index)=>{
  				if(item.grade){
  					return item.grade.id==vm.gradeId;
  				}
  			});
  	},
  	...mapGetters(['surveies','grades','teachers','clazzes','courses','questionnaires'])
  },
  methods:{
  	save(){
  		this.form.status='未开启';
  		this.saveOneSurvey(this.form).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '保存失败'
          });
        }
      }).catch((error)=>{
         this.$notify.error({
            title: '错误',
            message: '保存失败'
          });
      });
      this.dialogFormVisible=false;
  	},
  	gradeChange(){
  		this.form.clazzId='';
  	},
  	// 预览
  	handleEyes(index,row){
  		this.currentSurvey=row;
  		this.dialogEyeVisible=true;
  	},
  	// 编辑
  	handleEdit(index,row){
  		this.form={
  			id:row.id,
  			clazzId:row.clazzVM?row.clazzVM.id:'',
  			courseId:row.course?row.course.id:'',
  			userId:row.user.id,
  			questionnaireId:row.qnVM?row.qnVM.id:'',
  			surveydate:this.getCurrentDate(),
  		};
  		this.gradeId=(row.clazzVM&&row.clazzVM.grade)?row.clazzVM.grade.id:'';
  		this.dialogTitle='修改信息';
  		this.dialogFormVisible=true;
  	},
  	handleDelete(index,row){
  		this.deleteSurveyById({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '删除失败'
          });
        }
      }).catch((error)=>{
         this.$notify.error({
            title: '错误',
            message: '删除失败'
          });
      });
      this.findAllSurvey();
  	},
  	handleSelectionChange(val) {
      // 选择出来的对象组成的数组
      this.multipleSelection = val;
    },
  	typeChange(){
  		this.choice.search='';
  	},
  	batchDelete(){
  		let ids=this.multipleSelection.map((item)=>{
  			return item.id;
  		});
  		this.batchSurvey({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '批量删除失败'
          });
        }
      }).catch((error)=>{
         this.$notify.error({
            title: '错误',
            message: '批量删除失败'
          });
      });
      this.findAllSurvey();
  	},
  	add(){
  		this.dialogTitle='新增';
  		this.dialogFormVisible=true;
  		this.gradeId='';
  		this.form={
  			clazzId:'',
  			courseId:'',
  			userId:'',
  			questionnaireId:'',
  		}
  	},
  	// 获取当前时间返回字符串
  	// 2019-11-07 08:34:03
  	getCurrentDate(){
  		let date=new Date();
  		let year=date.getFullYear();
  		let month=date.getMonth()+1;
  		month=month<10?('0'+month):month;
  		let day=date.getDate();
  		day=day<10?('0'+day):day;
  		let hours=date.getHours();
  		hours=hours<10?('0'+hours):hours;
  		let minutes=date.getMinutes();
  		minutes=minutes<10?('0'+minutes):minutes;
  		let seconds=date.getSeconds();
  		seconds=seconds<10?('0'+seconds):seconds;
  		return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
  		// 非IE
  		// new Date('2019-11-07 08:34:03')
  		// IE
  		// new Date('2019/11/07 08:34:03')
  		// 获取时间戳,JS转换的是毫秒
  		// date.getTime();
  	},
    ...mapActions(['findAllSurvey','saveOneSurvey','batchSurvey','deleteSurveyById','findAllGrade','findAllTeacher','findAllClazz','findAllCourse','findAllQuestionnaire'])
  },
}
</script>

<style scoped>
  .el-input,.optionDiv input{
    width: 200px;
  }
  .el-dialog__body{
    padding:10px;
  }
</style>
<style scoped lang='scss'>
  .sManage{
    .optionDiv{
      button{
        float: right;
        margin-left: 10px;
      }
    }
    .contentDiv{
      .itemDiv{
        border:1px solid #777777;
        /*margin-top:10px;*/
        padding:5px 0px;
        border-top: none;
        ul{
          list-style:none;
          padding-left:10px;
          margin-bottom:0;
          margin-top:0;
        }
      }
    }
    .eyeTable{
    	border-collapse: collapse;
    	width: 100%;
    	line-height: 30px;
    	td{
    		border: 1px solid #777;
    		text-align: center;
    	}
    }
    .tableDiv i{
      cursor: pointer;
      font-size: 18px;
      margin: 0 5px;
    }
  }
</style>