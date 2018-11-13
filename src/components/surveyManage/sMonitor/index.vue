<!-- 课调监控页面 -->
<template>
  <div class="sMonitor">
    <div class="optionDiv">
      <el-select v-model="choice.type" placeholder="请选择所属年级" clearable @change='typeChange'>
          <el-option v-for='(item,index) in typeArr' :key='index' :label="item.name" :value="item.value"></el-option>
      </el-select>
      <el-input v-model="choice.search" placeholder="请输入内容" clearable 
      :disabled='Boolean(choice.type?0:1)'></el-input>
    </div>
    <div class="tableDiv">
      <el-table :height='tableHeight' tooltip-effect="dark" :data='monitorList' style="width: 100%">
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
        <el-table-column label="课调编号" prop='code' align='center'></el-table-column>
        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
            <i v-if="scope.row.status=='未开启'" class="fa fa-play" @click="start(scope.$index, scope.row)" title="开启" style="color:teal"></i>
            <i v-if="scope.row.status=='开启'" class="fa fa-hourglass-start" @click="progress(scope.$index, scope.row)" title="查看进度" style="color:#717C0A"></i>
            <i v-if="scope.row.status=='开启'" class="fa fa-stop-circle-o" @click="stop(scope.$index, scope.row)" title="结束" style="color:#E79597"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <div id="monitorContainer" style="min-width:400px;height:400px">
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
      dialogTitle:'课调进度',
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
      progressData:[
        ['已完成',30],
        ['未完成',10],
      ]
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
  	monitorList(){
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
    progress(index,row){
      this.dialogFormVisible=true;
      setTimeout(()=>{
        this.toDraw();
      },200);
    },
    toDraw(){
      var chart = Highcharts.chart('monitorContainer', {
        credits:{
          enabled:false,
        },
        colors:['#ccc','red'],
        chart: {
          spacing : [0, 0 , 0, 0],
        },
        title: {
          floating:true,
          text: '课调进度'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> {point.y}份'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            },
            point: {
              events: {
                mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                  // 标题更新函数，API 地址：https://api.hcharts.cn/highcharts#Chart.setTitle
                  chart.setTitle({
                    text: e.target.name+ '\t'+ e.target.y + ' 份'
                  });
                }
                //, 
                // click: function(e) { // 同样的可以在点击事件里处理
                //     chart.setTitle({
                //         text: e.point.name+ '\t'+ e.point.y + ' %'
                //     });
                // }
              }
            },
          }
        },
        series: [{
          type: 'pie',
          innerSize: '70%',
          name: '进度',
          data: this.progressData
        }]
      }, function(c) { // 图表初始化完毕后的会掉函数
        // 环形图圆心
        var centerY = c.series[0].center[1],
          titleHeight = parseInt(c.title.styles.fontSize);
        // 动态设置标题位置
        c.setTitle({
          y:centerY + titleHeight/2
        });
      });
    },
  	start(index,row){
  		this.startSurvey({id:row.id}).then((data)=>{
  			console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '开启成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '开启失败'
          });
        }
      }).catch((error)=>{
         this.$notify.error({
            title: '错误',
            message: '开启失败'
          });
      });
      this.findAllSurvey();
  	},
  	stop(index,row){
  		this.stopSurvey({id:row.id}).then((data)=>{
  			console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '结束成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '结束失败'
          });
        }
      }).catch((error)=>{
         this.$notify.error({
            title: '错误',
            message: '结束失败'
          });
      });
      this.findAllSurvey();
  	},
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
  	typeChange(){
  		this.choice.search='';
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
    ...mapActions(['findAllSurvey','startSurvey','stopSurvey'])
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
  .sMonitor{
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
    }
  }
</style>