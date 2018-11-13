<!-- 课程管理页面 -->
<template>
  <div class="course">
	<!-- {{teachers}} -->
	<!-- {{courses}} -->
	<!-- {{grades}} -->
	<!-- {{chargeName}} -->
    <div class="optionDiv">
      <el-input v-model="search" placeholder="请输入内容"></el-input>
      <el-button type="danger" @click='batchDeleteCourse'>批量删除</el-button>
      <el-button type="success" @click='addCourse'>新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table height='420px' ref="multipleTable" tooltip-effect="dark" :data='courseList' style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="课程名称" prop='name' align='center'></el-table-column>
        <el-table-column prop="period" label="课程周期" align='center'></el-table-column>
        <el-table-column prop="description" label="课程简介" align='center'></el-table-column>
        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
          	<i class="fa fa-pencil-square-o" @click="handleEditCourse(scope.$index, scope.row)" title="编辑" style="color:teal"></i>
          	<i class="fa fa-trash" @click="handleDeleteCourse(scope.$index, scope.row)" title="删除" style="color:#E79597"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules='rules' ref='form'>
        <el-form-item label="课程名称" :label-width="formLabelWidth" prop='name'>
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程周期" :label-width="formLabelWidth" prop='period'>
          <el-input v-model.number="form.period" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程简介" :label-width="formLabelWidth" prop='description'>
          <el-input type='textarea' v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCourse('form')">保 存</el-button>
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
      dialogTitle:'添加课程信息',
      dialogFormVisible:false,
      formLabelWidth:'80px',
      form:{
      },
      ids:[],
      rules:{
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
          ],
        description:[
          { required: true, message: '请输入课程简介', trigger: 'blur' }
        ],
        period:[
          { required: true, message: '请选择课程周期', trigger: 'blur' },
          { type:'number', message: '课程时期必须为数值', trigger: 'blur' }
        ],
      },
      // courses:[]
    }
  },
  created(){
    let vm=this;
    vm.findAllCourse();
  },
  computed:{
   	courseList(){
      // 对teacherList进行搜索条件过滤
      let vm=this;
      return vm.courses.filter((item)=>{
        if(item.name){
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return false;
        }
      });
    },
  	...mapGetters(['courses'])
  },
  methods:{
    // 批量删除
    batchDeleteCourse(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      console.log(ids);
      // ids:[1,2,3]
      // ids.join(',')
      // ids:{1,2,3}
      this.batchCourse({ids:ids.join(',')}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllCourse();
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
    addCourse(){
      this.form={

      };
      this.dialogFormVisible=true;
    },
    // 保存
    saveCourse(formName){
      // 向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的任何代码
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveOneCourse(this.form).then((data)=>{
              console.log(data);
              if(data.stauts==200){
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                });
                this.dialogFormVisible=false;
                this.findAllCourse();
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        // resetForm(formName) {
        //   this.$refs[formName].resetFields();
        // }
    },
    handleSelectionChange(val) {
      // 选择出来的对象组成的数组
      this.multipleSelection = val;
    },
    handleEditCourse(index, row) {
      this.dialogTitle='编辑班级信息';
      this.form={
	     name:row.name,
	     period:row.period,
	     id:row.id,
	     description:row.description
 	    };
      this.dialogFormVisible=true;
      this.findAllCourse();
    },
    handleDeleteCourse(index, row) {
      this.deleteCourseById({id:row.id}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllCourse();
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
    ...mapActions(['findAllCourse','saveOneCourse','deleteCourseById','batchCourse'])
  }
}
</script>

<style scoped>
  .optionDiv .el-input{
    width: 200px;
  }
</style>
<style scoped lang='scss'>
  .course{
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