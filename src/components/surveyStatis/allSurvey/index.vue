<!-- 全部课调统计页面 -->
<template>
  <div class="allSurvey">
    <div class="optionDiv">
      <!-- {{passSurvey}} -->
      <!-- {{surveies}} -->
      <el-select v-model="choice.gradeId" placeholder="请选择年级" clearable @change="gradeChange">
      		<el-option label='全部年级' value=''></el-option>
          <el-option v-for='(item,index) in grades' :key='index' :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select v-model="choice.clazzId" placeholder="请选择班级" clearable :disabled='Boolean(choice.gradeId?0:1)'>
      		<el-option label='全部班级' value=''></el-option>
          <el-option v-for='(item,index) in clazzList' :key='index' :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select v-model="choice.courseId" placeholder="请选择课程" clearable>
      		<el-option label='全部课程' value=''></el-option>
          <el-option v-for='(item,index) in courses' :key='index' :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select v-model="choice.questionnaireId" placeholder="请选择问卷" clearable>
      		<el-option label='全部问卷' value=''></el-option>
          <el-option v-for='(item,index) in questionnaires' :key='index' :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-input v-model="choice.search" placeholder="请输入内容" clearable :disabled='Boolean(choice.questionnaireId?1:0)'></el-input>
    </div>
    <div class="tableDiv">
      <el-table :height='tableHeight' tooltip-effect="dark" :data='surveyList' style="width: 100%">
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
        <el-table-column label="平均分" prop='average' align='center'>
        	<template slot-scope='scope'>
        		<span>
        			{{scope.row.average?scope.row.average:'----'}}
        		</span>
        	</template>
        </el-table-column>
        <el-table-column label="操作" align='center'>
           <template slot-scope="scope">
              <!-- <i class="fa fa-eye" @click="handleEye(scope.$index, scope.row)" title="预览" style="color:teal"></i> -->
              <i class="fa fa-download" @click="handleDownload(scope.$index, scope.row)" title="下载" style="color:#E79597"></i>
              <i class="fa fa-bar-chart" @click="handleStatis(scope.$index, scope.row)" title="课调分析" style="color:#717C0A"></i>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <div id="allSurveyContainer" style="min-width:400px;height:400px">
      </div>
    </el-dialog>
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
    		gradeId:'',
    		clazzId:'',
    		courseId:'',
    		questionnaireId:''
    	},
    	tableHeight:'300px',
    	dialogTitle:'课调分析',
    	dialogFormVisible:false
    }
  },
  computed:{
  	// 通过用户选择的年级来获取对应的班级
  	clazzList(){
  		let vm=this;
			return vm.clazzes.filter((item,index)=>{
				if(vm.choice.gradeId&&item.grade){
					return item.grade.id==vm.choice.gradeId;
				}else{
					return true;
				}
			})
  	},
		surveyList(){
			// 对课调进行过滤，过滤的条件是用户的选择
      let vm=this;
			return vm.passSurvey.filter((item)=>{
        // return true;
        if(vm.choice.gradeId){
          if(vm.choice.clazzId){
            if(vm.choice.courseId){
              if(vm.choice.naireId){
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.clazzVM.id==vm.choice.clazzId&&item.course.id==vm.choice.courseId&&item.qnVM.id==vm.choice.naireId;
              }else if(vm.choice.search){
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.clazzVM.id==vm.choice.clazzId&&item.course.id==vm.choice.courseId&&(item.qnVM.name.indexOf(vm.choice.search)!=-1);
              }else{
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.clazzVM.id==vm.choice.clazzId&&item.course.id==vm.choice.courseId;
              }
            }
            return item.clazzVM.grade.id==vm.choice.gradeId&&item.clazzVM.id==vm.choice.clazzId;
          }else if(vm.choice.courseId){
              if(vm.choice.naireId){
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.course.id==vm.choice.courseId&&item.qnVM.id==vm.choice.naireId;
              }else if(vm.choice.search){
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.course.id==vm.choice.courseId&&(item.qnVM.name.indexOf(vm.choice.search)!=-1);
              }else{
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.course.id==vm.choice.courseId;
              }
          }else if(vm.choice.naireId){
            return item.clazzVM.grade.id==vm.choice.gradeId&&item.qnVM.id==vm.choice.naireId;
          }else if(vm.choice.search){
            return item.clazzVM.grade.id==vm.choice.gradeId&&item.qnVM.name.indexOf(vm.choice.search)!=-1;
          }else{
            return item.clazzVM.grade.id==vm.choice.gradeId;
          }
        }else if(vm.choice.courseId){
          if(vm.choice.naireId){
            return item.course.id==vm.choice.courseId&&item.qnVM.id==vm.choice.naireId;
          }else if(vm.choice.search){
            return item.course.id==vm.choice.courseId&&(item.qnVM.name.indexOf(vm.choice.search)!=-1);
          }else{
            return item.course.id==vm.choice.courseId;
          }
        }else if(vm.choice.naireId){
          return item.qnVM.id==vm.choice.naireId;
        }else if(vm.choice.search){
          return item.qnVM.name.indexOf(vm.choice.search)!=-1;
        }else{
          return true;
        }
      });
		},
  	...mapGetters(['grades','teachers','clazzes','courses','questionnaires','passSurvey'])
  },
  created(){
  	this.findAllGrade();
  	this.findAllClazz();
  	this.findAllCourse();
  	this.findAllQuestionnaire();
  	this.findAllSurvey();
  	this.tableHeight=$(window).height()-200;
  },
  methods:{
  	handleEye(index,row){},
  	handleDownload(index,row){
  		window.open('http://120.78.164.247:9999/result/downLoadQnResult?id='+row.id);
  	},
  	handleStatis(index,row){
  		this.dialogFormVisible=true;
  		setTimeout(()=>{
  			this.toDraw();
  		},200);
  	},
  	toDraw(){
      var chart = Highcharts.chart('allSurveyContainer', {
        credits:{
          enabled:false,
        },
        chart: {
          type: 'bar'
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: ['授课质量', '备课情况', '扩展能力', '技术能力', '亲和力'],
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: '评分情况',
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          }
        },
        tooltip: {
          valueSuffix: ' 次'
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              allowOverlap: true // 允许数据标签重叠
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 100,
          floating: true,
          borderWidth: 1,
          backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
          shadow: true
        },
        series: [{
          name: '优秀',
          data: [107, 31, 35, 203, 2]
        }, {
          name: '良好',
          data: [133, 156, 47, 48, 6]
        }, {
          name: '中等',
          data: [73, 14, 44, 32, 34]
        }]
      });
  	},
    gradeChange(){
      this.choice.clazzId = '';
    },
  	...mapActions(['findAllSurvey','findAllGrade','findAllClazz','findAllCourse','findAllQuestionnaire'])
  },
}
</script>
<style scoped>
  .el-input,.optionDiv input{
    width: 200px;
  }
</style>
<style scoped lang='scss'>
  .allSurvey{
    .tableDiv i{
      cursor: pointer;
      font-size: 18px;
      margin: 0 5px;
    }
  }
</style>