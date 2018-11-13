<!-- 课调审核页面 -->
<template>
  <div class="sCheck">
    <div class="optionDiv">
      <el-select v-model="choice.type" placeholder="请选择所属年级" clearable @change='typeChange'>
          <el-option v-for='(item,index) in typeArr' :key='index' :label="item.name" :value="item.value"></el-option>
      </el-select>
      <el-input v-model="choice.search" placeholder="请输入内容" clearable :disabled='Boolean(choice.type?0:1)'></el-input>
    </div>
    <div class="tableDiv">
      <el-table :height='tableHeight' tooltip-effect="dark" :data='checkList' style="width: 100%">
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
        <el-table-column label="状态" prop='status' align='center'></el-table-column>
        <el-table-column label="操作" align='center'>
           <template slot-scope="scope">
              <i class="fa fa-check" v-if="scope.row.status=='未审核'" @click="handleCheck(scope.$index, scope.row,1)" title="审核通过" style="color:teal"></i>
              <i class="fa fa-times" v-if="scope.row.status=='未审核'" @click="handleCheck(scope.$index, scope.row,0)" title="审核不通过" style="color:#E79597"></i>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
import Highcharts from 'highcharts';
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
  			status:'',
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
  },
  mounted(){
  	// 设置元素的高度，渲染完毕后，选中
  	// vue实例与DOM树绑定并且渲染完毕
  },
  computed:{
  	checkList(){
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
  	...mapGetters(['surveies'])
  },
  methods:{
    handleCheck(index,row,value){
      let obj={
        id:row.id,
        status:value
      };
      this.finalCheckSurvey(obj).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '操作失败'
          });
        }
      }).catch((error)=>{
         this.$notify.error({
            title: '错误',
            message: '操作失败'
          });
      });
      this.findAllSurvey();
    },
  	gradeChange(){
  		this.form.clazzId='';
  	},
  	typeChange(){
  		this.choice.search='';
  	},
    ...mapActions(['findAllSurvey','finalCheckSurvey'])
  },
}
</script>
<style scoped>
  .el-input,.optionDiv input{
    width: 200px;
  }
</style>
<style scoped lang='scss'>
  .sCheck{
    .tableDiv i{
      cursor: pointer;
      font-size: 18px;
    }
  }
</style>