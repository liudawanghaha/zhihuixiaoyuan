<!-- 题目管理页面 -->
<template>
  <div class="quesManager">
    <div class="optionDiv">
    	<!-- {{questions}} -->
    	<!-- {{selected}} -->
      <el-select v-model="choice.type" placeholder="请选择题目类型" clearable>
        <el-option v-for='(item,index) in types' :key='index' :label="item" :value="item" clearable></el-option>
      </el-select>
      <el-input v-model="choice.search" placeholder="请输入内容"></el-input>
      <el-button type="danger" @click='batchDeleteQuestion'>批量删除</el-button>
      <el-button type="success" @click='addQuestion'>新增</el-button>
    </div>
    <div class="contentDiv">
    	<div v-for='(item,index) in quesList' class="itemDiv">
    		<!-- {{item}} -->
    		<ul>
    			<li>
						<input type='checkbox' v-model='selected' :value='item.id'></input>
						序号{{index+1}}:{{item.name}}</li>
    			<li v-for='(option,num) in 	item.options' style='padding-left: 30px'>{{option.label}}.&nbsp;{{option.name}}</li>
    		</ul>
		    <div class="iconDiv">
		    	<i class="fa fa-pencil-square-o" @click="handleEdit(item)" title="编辑" style="color:teal"></i>
		    	<i class="fa fa-trash-o" @click="handleDelete(item)" title="删除" style="color:#E79597"></i>
		    </div>
    	</div>
    </div>
    <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
      	 <!-- :rules='rules' ref='form' -->
        <el-form-item label="题目名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style='width:230px;'></el-input>
        </el-form-item>
        <el-form-item label="题目类型" :label-width="formLabelWidth">
          <el-select v-model="form.questionType" placeholder="请选择题目类型" clearable @change='selectChange'>
          	<!-- select下拉列表的change事件 -->
		        <el-option v-for='(item,index) in types' :key='index' :label="item" :value="item" clearable></el-option>
		      </el-select>
        </el-form-item>
        <el-form-item v-if='showTable' label="题目选项" :label-width="formLabelWidth" style='margin-bottom: 0px;'>
          <el-table height='300px' @row-click='showSpan=false' :data='form.options' style="width: 100%">
        		<el-table-column type="index" label='序号' width="55"></el-table-column>
        		<el-table-column label="label" prop='label'>
        			<template slot-scope="scope">
		           	<span v-if='showSpan'>{{scope.row.label}}</span>
		           	<el-input v-else v-model='scope.row.label'></el-input>
         			</template>
        		</el-table-column>
        		<el-table-column prop="name" label="选项">
        			<template slot-scope="scope">
		           	<span v-if='showSpan'>{{scope.row.name}}</span>
		           	<el-input v-else v-model='scope.row.name'></el-input>
         			</template>
        		</el-table-column>
        		<el-table-column prop="score" label="分值">
        			<template slot-scope="scope">
		           	<span v-if='showSpan'>{{scope.row.score}}</span>
		           	<el-input v-else v-model='scope.row.score'></el-input>
         			</template>
        		</el-table-column>
        		<el-table-column label="操作">
          		<template slot-scope="scope">
		            <i class="fa fa-trash" @click="handleDeleteOption(scope.$index, scope.row)" title="删除" style="color:#E79597"></i>
         		 </template>
		        </el-table-column>
		      </el-table>
		      <!-- 添加选项按钮 -->
					<div class="addIcon" align="center">
						<i class="fa fa-plus" title="添加选项" @click='addOption'></i>
					</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveQuestion">保 存</el-button>
      </div>
    </el-dialog>
    <router-view/>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
export default {
  data(){
    return {
      dialogTitle:'添加题目信息',
      dialogFormVisible:false,
      formLabelWidth:'80px',
      choice:{
        type:'',
        search:'',
      },
      selected:[],
      form:{
        name:'',
        questionType:'单选题',
        options:[]
      },
      types:['单选题','多选题','简答题'],
    	showTable:true,
    	showSpan:true,
    	ids:[]
    }
  },
  computed:{
   	quesList(){
      // 对teacherList进行搜索条件过滤
      let vm=this;
      return vm.questions.filter((item)=>{
        if(item.name){
          if(item.questionType&&vm.choice.type){
            return (item.name.indexOf(vm.choice.search)!=-1)&&(item.questionType==vm.choice.type);
          }
          return item.name.indexOf(vm.choice.search)!=-1;
        }else{
          return false;
        }
      });
    },
  	...mapGetters(['questions'])
  },
  created(){
    let vm=this;
    vm.findAllQuestions();
  },
  mounted(){
  	$('.contentDiv').height($(window).height()-200);
  },
  methods:{
  	// 删除
  	handleDeleteOption(index,row){
  		// this.form.options
  		// {name:'',label:'',score:3}
  		// 通过index删除对应位置上的对象
  		this.form.options.splice(index,1);
  	},
  	// 添加选项
  	addOption(){
  		// 给表格添加一行
  		this.form.options.push({
  			name:'',
  			label:'',
  			score:'',
  		});
  	},
    // 批量删除
    batchDeleteQuestion(){
      // 获取用户选中的复选框对应对象的id
      // let ids=this.selected.map((item)=>{
      //   return item;
      // });
      this.batchQuestion({ids:this.selected.join(',')}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllQuestions();
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
    },
    // 模态框的下拉列表更改
    selectChange(val){
    	// val 最新的值->questionType
    	if(val=='简答题'){
    		this.showTable=false;
    	}else{
    		this.showTable=true;
    	}
    },
    // 新增
    addQuestion(){
      this.dialogFormVisible=true;
      this.form={
      	name:'',
      	questionType:'单选题',
      	options:[]
      };
      this.showTable=true;
      this.showSpan=true;
    },
    // 保存
    saveQuestion(){
      // 向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的任何代码
      this.saveOneQuestion(this.form).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false;
          this.findAllQuestions();
        }else{
          this.dialogFormVisible=false;
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
         this.dialogFormVisible=false;
      });
    },
    handleSelectionChange(val) {
      // 选择出来的对象组成的数组
      this.multipleSelection = val;
    },
    handleEdit(ques) {
      // console.log(ques);
      this.dialogTitle='编辑题目信息';
      this.showSpan=true;
      this.form={
	     id:ques.id,
	     name:ques.name,
	     questionType:ques.questionType,
	     options:JSON.parse(JSON.stringify(ques.options)),
 	    };
      this.dialogFormVisible=true;
      this.findAllQuestions();
    },
    handleDelete(ques){
    	this.deleteQuestionById({id:ques.id}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllQuestions();
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
    },
    ...mapActions(['findAllQuestions','saveOneQuestion','deleteQuestionById','batchQuestion'])
  }
}
</script>


<style scoped lang='scss'>
  .quesManager{
    .optionDiv{
      .el-input{
		    width: 200px;
		  }
      button{
        float: right;
        margin-left: 10px;
      }
    }
    .contentDiv{
    	overflow: auto;
	    .itemDiv{
	    	border: 1px solid #777;
	    	margin-top: 10px;
	    	ul{
	    		list-style: none;
	    		padding: 20px;
	    		margin-bottom: 0px;
	    	}
	    	.iconDiv{
	    		font-size: 20px;
	    		text-align: right;
	    		margin: 0px 10px;
	    	}
	    }
    }
    .addIcon{
    	font-size: 20px;
    	text-align: center;
    	i{
    		cursor: pointer;
    	}
    }
  }
</style>
