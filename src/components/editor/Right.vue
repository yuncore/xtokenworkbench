<template>
  <div class="sidebar-right">
    <div class="editor-tool">
      <ul>
        <li @click="delSection">删除样式</li>
        <li @click="clear()">清空内容</li>
        <!--<li @click="preview()">手机预览</li>-->
        <!--<li>另存为模板</li>-->
        <li @click="done()">编辑完成</li>
      </ul>
    </div>
    <div class="match-color">
      <h3>配色方案</h3>
      <ul>
        <li v-for="(color, index) in colorArr" :style="{backgroundColor: color}" @click="changeColor(index)"></li>
      </ul>
    </div>
  </div>
</template>
<style>
   @import "css/global.css";
</style>
<script>
 export  default {
   data: function() {
     return {
       colorArr: [
          '#ac1d10',
          '#d82821',
          '#ef7060',
          '#fde2d8',
          '#d32a63',
          '#eb6794',
          '#f5bdd1',
          '#ffebf0',
          '#e2561b',
          '#ff8124',
          '#fcb42b',
          '#feecaf',
          '#0c8918',
          '#80b135',
          '#c2c92a',
          '#e5f3d0',
          '#374aae',
          '#1e9be8',
          '#59c3f9',
          '#b6e4fd',
          '#8d4bbb',
          '#a65bcb',
          '#cca4e3',
          '#be7763',
          '#212122',
          '#757576',
          '#c6c6c7',
          '#f5f5f4'
       ]
     }
   },
   methods: {
     changeColor: function (index, evt) {
       this.$emit('clickColor', {color: this.colorArr[index]});
     },
     clear: function () {
       this.$emit('clearContent')
     },
     delSection: function () {
       this.$emit('delSection')
     },
     preview: function () {
       this.$emit("preview")
     },
     done: function() {
       this.$emit("done")
     }
   }
 }
</script>
