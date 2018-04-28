<template>
  <div style="margin-top: 20px">
    <center>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-size="pageSize"
                   :total="total"  layout="prev, pager, next">
    </el-pagination>
    </center>
  </div>
</template>
<script>
  import net_util from '../assets/js/net_utils'
  import utils from '../assets/js/utils'

  export default{
    props: ["baseUrl", "urlParams" ],
    data: function () {
      return {
        pageSize: 9,
        currentPage: 1,
        total: 0,
        pageCount: 0,
      }
    },
    watch: {
      'urlParams': {
        handler: function (val, oldVal) {
          this.getData(this.urlParams.page ? this.urlParams.page : 1);
        }
      }
    },
    methods: {
      handleSizeChange(val){
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange(val){
        this.getData(val)
        console.log(`当前页: ${val}`)
      },
      handleResponse(resMsg , page){
        this.total = resMsg.result.count;
        this.currentPage = page
        this.$emit("bindData", {data : resMsg})
      },
      getData(page){

        var self = this
        if(!this.baseUrl){
          return
        }
        this.urlParams.page =  page
        this.asyncGetData(page).then((resMsg)=>{
            //alert(JSON.stringify(resMsg))
          if(resMsg.errorCode == 0){
            self.handleResponse(resMsg , page)
          }else{
            self.$emit("bindData", {data: null})
            self.$message({type: 'error', message: resMsg.errorMsg})
          }
        }).catch((err)=>{
          self.$emit("bindData", {data: null})
          self.$message({type: 'error', message: '查询列表出错！'})
        })
      },
      asyncGetData: function (page) {
        var self = this
        console.log(this.baseUrl);
        console.log(JSON.stringify(this.urlParams))
        var p = new Promise(function (resolve, reject) {
            var succ = function success(resMsg) {
              resolve(resMsg)
            };
            var fail = function error(resMsg) {
              reject(resMsg);
            };
            net_util.getRequest(self.baseUrl, self.urlParams, succ, fail, self, "admin");
          })
          ;
        return p;
      },
    },
    mounted: function () {
      this.getData(this.urlParams.page ? this.urlParams.page : 1)
    }
  }
</script>
<style>
</style>
