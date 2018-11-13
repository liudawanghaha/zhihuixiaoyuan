<!-- 学校信息页面 -->
<template>
  <div class="school">
  	<table :data='schools' class="table">
  		<tr v-for='(item,index) in tableArr' @click='show=false'>
  			<td>{{item.name}}</td>
  			<td>
				<span v-if='show'>{{schools[item.prop]}}</span>
				<el-input v-model="form[item.prop]" placeholder="请输入内容" v-else class='messageInput'></el-input>
  			</td>
  		</tr>
  	</table>
  	<el-button type="success" @click='saveSchool'>保存</el-button>
    <router-view/>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
      tableArr:[{
      	name:'校园名称',
      	prop:'name'
      },{
      	name:'校园介绍',
      	prop:'description'
      },{
      	name:'校园地址',
      	prop:'address'
      },{
      	name:'校园电话',
      	prop:'telephone'
      },{
      	name:'版权信息',
      	prop:'copyright'
      }],
      form:{

      },
      show:true,
    }
  },
  created(){
    let vm=this;
    vm.findSchool({id:3}).then((data)=>{
    	// data=>schools
    	this.form={
    		id:data.id,
    		name:data.name,
    		description:data.description,
    		address:data.address,
    		telephone:data.telephone,
    		copyright:data.copyright,
    	};
    });
  },
  computed:{
  	...mapGetters(['schools'])
  },
  methods:{
    // 保存
    saveSchool(){
      // 向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的任何代码
      this.saveOneSchool(this.form).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false
          this.show=true;
          this.findSchool({id:3});
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
    ...mapActions(['findSchool','saveOneSchool'])
  }
}
</script>

<style scoped lang='scss'>
  .school{
  	.table{
  		border-collapse: collapse;
  		tr{
  			td{
  				border:1px solid #ccc;
  				height: 40px;
  				text-align: center;
  				.messageInput{
  					width: 1000px;
  				}
  			}
        td:nth-child(1){
          width: 100px;
        }
  			td:nth-child(2){
  				width: 1000px;
  			}
  		}
  	}
  	button{
  		float: right;
  		margin-right: 100px;
  		margin-top: 30px;
  	}
  }
</style>