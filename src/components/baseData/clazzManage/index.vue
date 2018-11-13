<!-- 班级管理页面 -->
<template>
  <div class="clazz">
    <div class="optionDiv">
      <el-select v-model="choice.gradeId" placeholder="请选择所属年级" clearable>
            <el-option v-for='(item,index) in grades' :key='index' :label="item.name" :value="item.id"></el-option>
          </el-select>
      <el-input v-model="choice.search" placeholder="请输入内容"></el-input>
      <el-button type="danger" @click='batchDeleteClazz'>批量删除</el-button>
      <el-button type="success" @click='addClazz'>新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table height='420px' ref="multipleTable" tooltip-effect="dark" :data='clazzList' style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="班级名称" prop='name' align='center'></el-table-column>
        <el-table-column prop="description" label="班级简介"  align='center'></el-table-column>
        <el-table-column prop="grade.name" label="所属年级"  align='center'></el-table-column>
        <el-table-column prop="charge.name" label="班主任" align='center'></el-table-column>
        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
          	<i class="fa fa-pencil-square-o" @click="handleEditClazz(scope.$index, scope.row)" title="编辑" style="color:teal"></i>
          	<i class="fa fa-trash" @click="handleDeleteClazz(scope.$index, scope.row)" title="删除" style="color:#E79597"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
      	<el-form-item label="所属年级" :label-width="formLabelWidth">
          <el-select v-model="form.gradeId" placeholder="请选择所属年级">
            <el-option v-for='(item,index) in grades' :key='index' :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班主任" :label-width="formLabelWidth">
          <el-select v-model="form.chargeId" placeholder="请选择班主任">
            <el-option v-for='(item,index) in teachers' :key='index' :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级简介" :label-width="formLabelWidth">
          <el-input type='textarea' v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveClazz">保 存</el-button>
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
      choice:{
        gradeId:'',
        search:''
      },
      multipleSelection:[],
      // teacherList:[],
      dialogTitle:'添加班级信息',
      dialogFormVisible:false,
      formLabelWidth:'80px',
      form:{
        
      },
      ids:[],
    }
  },
  created(){
    let vm=this;
    vm.findAllClazz();
    vm.findAllTeacher();
    vm.findAllGrade();
  },
  computed:{
   	clazzList(){
      // 对teacherList进行搜索条件过滤
      let vm=this;
      return vm.clazzes.filter((item)=>{
        if(item.name){
          if(item.grade&&vm.choice.gradeId){
            return (item.name.indexOf(vm.choice.search)!=-1)&&(item.grade.id==vm.choice.gradeId);
          }
          return item.name.indexOf(vm.choice.search)!=-1;
        }else{
          return true;
        }
      });
    },
  	...mapGetters(['clazzes','teachers','grades'])
  },
  methods:{
    // 批量删除
    batchDeleteClazz(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      this.batchClazz({ids:ids.join(',')}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllClazz();
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
    addClazz(){
      this.form={

      };
      this.dialogFormVisible=true;
    },
    // 保存
    saveClazz(){
      // 向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的任何代码
      this.saveOneClazz(this.form).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false;
          this.findAllClazz();
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
    handleEditClazz(index, row) {
      this.dialogTitle='编辑班级信息';
      this.form={
	     name:row.name,
	     gradeId:row.grade?row.gradeId:'',
	     chargeId:row.charge?row.chargeId:'',
	     id:row.id,
	     description:row.description
 	    };
      this.dialogFormVisible=true;
      this.findAllClazz();
    },
    handleDeleteClazz(index, row) {
      this.deleteClazzById({id:row.id}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllTeacher();
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
    ...mapActions(['findAllClazz','saveOneClazz','deleteClazzById','batchClazz','findAllTeacher','findAllGrade'])
  }
}
</script>

<style scoped>
  .el-input,.optionDiv .el-input{
    width: 230px;
  }
</style>
<style scoped lang='scss'>
  .clazz{
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
