<!-- 教师管理页面 -->
<template>
  <div class="teacher">
    <div class="optionDiv">
      <el-input v-model="search" placeholder="请输入内容"></el-input>
      <el-button type="danger" @click='batchDeleteTeacher'>批量删除</el-button>
      <el-button type="success" @click='addTeacher'>新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table height='420px' ref="multipleTable" tooltip-effect="dark" :data='teacherList' style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="教师姓名" prop='name' align='center'></el-table-column>
        <el-table-column prop="gender" label="性别" align='center'></el-table-column>
        <el-table-column prop="birth" label="出生日期" align='center'></el-table-column>
        <el-table-column prop="hiredate" label="入职时间" align='center'></el-table-column>
        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
          	<i class="fa fa-pencil-square-o" @click="handleEditTeacher(scope.$index, scope.row)" title="编辑" style="color:teal"></i>
          	<i class="fa fa-trash" @click="handleDeleteTeacher(scope.$index, scope.row)" title="删除" style="color:#E79597"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="教师姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教师性别" :label-width="formLabelWidth">
    			<el-radio-group v-model="form.gender">
      			<el-radio label="男"></el-radio>
      			<el-radio label="女"></el-radio>
    			</el-radio-group>
  			</el-form-item>
  			<el-form-item class="block" style="margin-left:10px">
    			<span class="demonstration">出生日期</span>
    			<el-date-picker v-model="form.birth" type="date" placeholder="选择日期" 
      		value-format="yyyy-MM-dd" style="margin-left:8px"></el-date-picker>
 				</el-form-item>
 				<el-form-item class="block" style="margin-left:10px">
    			<span class="demonstration">入职时间</span>
    			<el-date-picker v-model="form.hiredate" type="date" placeholder="选择日期"  style="margin-left:8px" 
      		value-format="yyyy-MM-dd"></el-date-picker>
 				</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTeacher">保 存</el-button>
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
      // teacherList:[],
      dialogTitle:'添加教师信息',
      dialogFormVisible:false,
      formLabelWidth:'80px',
      form:{
        schoolId:3,
      },
      ids:[],
      // courses:[]
    }
  },
  created(){
    let vm=this;
    vm.findAllTeacher();
      //data查找出来的数据
      // findAllTeacher  store  commit  ---> state.categories-->getters.categories-->computed.categories-->才能使用
      // findAllTeacher中有两条线，一条线commit  ---> state.categories-->getters.categories-->computed.categories-->页面才能使用
      // 一条线  resolve(data)
      // 在页面上调用了findAllCategory.then(function(data){})
      // console.log(data);
  },
  computed:{
   	teacherList(){
      // 对teacherList进行搜索条件过滤
      let vm=this;
      return vm.teachers.filter((item)=>{
        if(item.name){
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return false;
        }
      });
    },
  	...mapGetters(['teachers'])
  },
  methods:{
    // 批量删除
    batchDeleteTeacher(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      console.log(ids);
      // ids:[1,2,3]
      // ids.join(',')
      // ids:{1,2,3}
      this.batchTeacher({ids:ids.join(',')}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllTeacher();
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
    addTeacher(){
      this.form={
        schoolId:3,
      };
      this.dialogFormVisible=true;
    },
    // 保存
    saveTeacher(){
      // 向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的任何代码
      this.saveOneTeacher(this.form).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false;
          this.findAllTeacher();
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
    // toSearch(){
    //   let vm=this;
    //   this.teacherList=this.teachers.filter(function(item){
    //     if(item.name){
    //       return item.name.indexOf(vm.search)!=-1;
    //     }else{
    //       return true;
    //     }
    //   });
    // },
    handleSelectionChange(val) {
      // 选择出来的对象组成的数组
      this.multipleSelection = val;
    },
    handleEditTeacher(index, row) {
    	this.dialogTitle='编辑教师信息';
      this.form={
	      name:row.name,
	      gender:row.gender,
	      birth:row.birth,
	      hiredate:row.hiredate,
	      id:row.id,
	      schoolId:3
 	    };
     this.dialogFormVisible=true;
    },
    handleDeleteTeacher(index, row) {
      this.deleteTeacherById({id:row.id}).then((data)=>{
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
    ...mapActions(['findAllTeacher','saveOneTeacher','deleteTeacherById','batchTeacher'])
  }
}
</script>

<style scoped>
  .el-input,.optionDiv input{
    width: 200px;
  }
</style>
<style scoped lang='scss'>
  .teacher{
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
