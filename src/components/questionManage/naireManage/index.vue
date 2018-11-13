<!-- 问卷管理页面 -->
<template>
  <div class="naireManage">
    <div class="optionDiv">
      <el-input v-model="search" placeholder="请输入内容"></el-input>
      <el-button type="danger" @click='batchDeleteQuestionnaire'>批量删除</el-button>
      <el-button type="success" @click='addQuestionnaire'>新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table :height='tableHeight' tooltip-effect="dark" :data='naireList' style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align='center'></el-table-column>
        <el-table-column label="问卷名称" prop='name' align='center'></el-table-column>
        <el-table-column prop="description" label="问卷简介" align='center'></el-table-column>
        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
          	<i class="fa fa-eye" @click="handleEyes(scope.$index, scope.row)" title="预览" style="color:teal"></i>
            <i class="fa fa-pencil-square-o" @click="handleEditQuestionnaire(scope.$index, scope.row)" title="编辑" style="color:#717C0A"></i>
            <i class="fa fa-trash" @click="handleDeleteQuestionnaire(scope.$index, scope.row)" title="删除" style="color:#E79597"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="问卷名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问卷简介" :label-width="formLabelWidth">
          <el-input type='textarea' v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目列表" :label-width="formLabelWidth">
          <el-button plain @click='showTrans'>点击选择</el-button>
        </el-form-item>
        <!-- {{quesIds}} -->
      </el-form>
      <!-- {{questions}} -->
      <div class="contentDiv">
      	<div v-for='(item,index) in quesShowList' class="itemDiv">
    		<ul>
    			<li>{{index+1}}&nbsp;:&nbsp;{{item.name}}</li>
    			<li v-for='(option,num) in item.options' style='padding-left: 30px'>{{option.label}}.&nbsp;{{option.name}}</li>
          <!-- haha:{{item.options}} -->
    		</ul>
    	</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveQuestionnaire">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 二级模态框 穿梭框 -->
    <el-dialog :title="dialogTransTitle" :visible.sync="dialogTransVisible">
      <el-transfer v-model="quesIds" :data="quesList"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTransVisible = false">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 问卷预览 -->
    <el-dialog :title="naireWithQues.name" :visible.sync="dialogEyeVisible">
      <!-- {{naireWithQues}} -->
      <span>{{naireWithQues.description}}</span>
      <div class="contentDiv">
        <div class="itemDiv" v-for="(item,index) in naireWithQues.questionVMs">
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
    <router-view/>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
export default {
  data(){
    return {
      search:'',
      multipleSelection:[],
      dialogTitle:'创建问卷',
      dialogFormVisible:false,
      formLabelWidth:'80px',
      form:{
    	   name:'',
         description:'',
      },
      dialogTransTitle:'选择题目',
      dialogTransVisible:false,
      // 用户选择的穿梭框中的key值组成的数组
      quesIds:[],
      tableHeight:'300px',
      dialogEyeVisible:false,
      // 穿梭框左侧的列表数据
      // quesList:[{
      // 	key:1,
      // 	label:'h'
      // },{
      // 	key:2,
      // 	label:'h'
      // }]
    }
  },
  created(){
    let vm=this;
    vm.findAllQuestionnaire();
    vm.findAllQuesNoOption();
    this.tableHeight=($(window).height()-200)+'px';
    this.findAllQuestions();
    // vue实例，属性和方法创建完毕
  },
  mounted(){
  	// 设置元素的高度，渲染完毕后，选中
  	// vue实例与DOM树绑定并且渲染完毕
  },
  computed:{
    quesShowList(){
      // questions   所有的题目，包含选项
      // this.quesIds   [495,497]用户选择的题目id组成的数组
      // 
      return this.questions.filter((item,index)=>{
        return this.quesIds.indexOf(item.id)!=-1;
      });
    },
    // 将quesNoOption转换成穿梭框识别的数据
    quesList(){
    	let arr=[];
    	this.quesNoOption.forEach((item)=>{
	        let obj={
	        	key:item.id,
	        	label:item.name
	        };
	        arr.push(obj);
	    });
	    return arr;
    },
    naireList(){
      let vm = this;
      return this.questionnaires.filter((item)=>{
        if(item.name){
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return false;
        }
      });
    },
  	...mapGetters(['questionnaires','quesNoOption','questions','naireWithQues'])
  },
  methods:{
  	//点击选择题目
  	showTrans(){
  		// 显示穿梭框的模态框
  		this.dialogTransVisible=true;
  	},
    // 批量删除
    batchDeleteQuestionnaire(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      this.batchQuestionnaire({ids:ids.join(',')}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllQuestionnaire();
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
    // 新增
    addQuestionnaire(){
      	this.dialogFormVisible=true;
        this.dialogTransVisible=false;
        this.dialogTitle='新增问卷';
      	this.form={
      		name:'',
      		description:'',
      	};
        this.quesIds=[];
    },
    // 保存问卷
    saveQuestionnaire(){
      // 向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的任何代码
      this.form.questionIds=this.quesIds.join(',');
      this.saveOneQuestionnaire(this.form).then((data)=>{
        // console.log(data);
        // console.log('刘大王:'+JSON.stringify(data));
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false;
          this.findAllQuestionnaire();
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
    // 选择的对象
    handleSelectionChange(val) {
      // 选择出来的对象组成的数组
      this.multipleSelection = val;
    },
    // 编辑问卷
    handleEditQuestionnaire(index, row) {
      // row.id是问卷的id,去查找问卷的详细数据，包含题目的信息
      // 可以修改问卷的名字，描述，修改内部的题目
      this.dialogTitle='编辑问卷';
      // questionIds=this.quesIds.join(',');
      // alert(row.id);
      this.findNaireWithQues({id:row.id}).then((data)=>{
        this.form={
          id:data.id,
          name:data.name,
          description:data.description,
        };
        this.quesIds=data.questionVMs.map((item)=>{
          return item.id;
        });
        this.dialogFormVisible=true;
      });
    },
    // 根据id删除问卷
    handleDeleteQuestionnaire(index,row){
      this.deleteQuestionnaireById({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllQuestionnaire();
        }else{
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error'
          });
        }
      }).catch((error)=>{
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'error'
        });
      });
    },
    handleEyes(index,row){
      this.findNaireWithQues({id:row.id}).then((data)=>{
        this.dialogEyeVisible = true;
      });
    },
    ...mapActions(['findAllQuestionnaire','batchQuestionnaire','deleteQuestionnaireById','saveOneQuestionnaire','findAllQuesNoOption','findNaireWithQues','findAllQuestions'])
  },
}
</script>

<style scoped>
  .optionDiv .el-input{
    width: 200px;
  }
  .el-dialog__body{
    padding-top: 0;
  }
</style>
<style scoped lang='scss'>
  .naireManage{
    .optionDiv{
      button{
        float: right;
        margin-left: 10px;
      }
    }
    .contentDiv{
      .itemDiv{
        border:1px solid #DCDFE6;
        margin-top:10px;
        padding:5px 10px;
        margin-left: 10px;
        ul{
          list-style:none;
          padding: 5px;
          padding-left:10px;
          margin-bottom:0;
          margin-top:0;
        }
      }
    }
    .tableDiv i{
      cursor: pointer;
      font-size: 18px;
      margin: 0 5px;
    }
  }
</style>
