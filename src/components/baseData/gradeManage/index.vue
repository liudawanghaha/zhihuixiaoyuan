<!-- 年级管理页面 -->
<template>
  <div class="grade">
    <!-- {{gradeList}} -->
    <!-- {{grades}} -->
    <div class="optionDiv">
      <el-input v-model="search" placeholder="请输入内容"></el-input>
      <el-button type="danger" @click='batchDeleteGrade'>批量删除</el-button>
      <el-button type="success" @click='addGrade'>新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table height='420px' ref="multipleTable" tooltip-effect="dark" :data='gradeList' style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="名称" prop='name' align='center'></el-table-column>
        <el-table-column prop="descriptioin" label="简介" align='center'></el-table-column>
        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
            <i class="fa fa-pencil-square-o" @click="handleEditGrade(scope.$index, scope.row)" title="编辑" style="color:teal"></i>
            <i class="fa fa-trash" @click="handleDeleteGrade(scope.$index, scope.row)" title="删除" style="color:#E79597"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程简介" :label-width="formLabelWidth">
          <el-input type='textarea' v-model="form.descriptioin" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGrade">保 存</el-button>
      </div>
    </el-dialog>
    <router-view/>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
      search:'',
      multipleSelection:[],
      dialogTitle:'新增',
      dialogFormVisible:false,
      formLabelWidth:'80px',
      form:{
    	// schoolId:'3'
      },
      ids:[],
      schoolData:[],
    }
  },
  created(){
    let vm=this;
    vm.findAllGrade();
     
  },
  computed:{
    gradeList(){
      // 对gradeList进行搜索条件过滤
      let vm=this;
      return vm.grades.filter((item)=>{
        if(item.name){
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return false;
        }
      })
    },
  	...mapGetters(['grades'])
  },
  methods:{
    // 批量删除
    batchDeleteGrade(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      // console.log(ids);
      // ids:[1,2,3]
      // ids.join(',')
      // ids:{1,2,3}
      this.batchGrade({ids:ids.join(',')}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllGrade();
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
    addGrade(){
      	this.form={
        	schoolId:'3',
      	};
      	this.dialogFormVisible=true;
    },
    // 保存
    saveGrade(){
      // 向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的任何代码
      this.saveOneGrade(this.form).then((data)=>{
        // console.log(data);
        // console.log('刘大王:'+JSON.stringify(data));
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false;
          this.findAllGrade();
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
    handleEditGrade(index, row) {
      this.dialogTitle='编辑';
	    this.form={
		    name:row.name,
		    descriptioin:row.descriptioin,
		    id:row.id,
		    schoolId:3
	    };
     this.dialogFormVisible=true;
    },
    handleDeleteGrade(index, row) {
       this.deleteGradeById({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllGrade();
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
    ...mapActions(['findAllGrade','saveOneGrade','deleteGradeById','batchGrade'])
  }
}
</script>

<style scoped>
  .optionDiv .el-input{
    width: 200px;
  }
</style>
<style scoped lang='scss'>
  .grade{
    .optionDiv{
      button{
        float: right;
        margin-left: 10px;
      }
    }
    .tableDiv i{
      cursor: pointer;
      font-size: 18px;
      margin: 0 5px;
    }
  }
</style>
