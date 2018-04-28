<template>
    <div id="editor_preview" style="background-color: transparent">
      <div class="container">
        <div class="content" v-html="content" style="padding: 5px; margin-left: 0">

        </div>
      </div>
    </div>
</template>
<style>
  #editor_preview img {
   width: 100%;
  }

  #editor_preview .container {
    background: url(./images/shouji.svg) no-repeat;
    background-size: 100%;
    width: 370px;
    height: 780px;
    position: relative;
  }
  #editor_preview .container .content {
    width: 300px;
    height: 490px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -30px;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    overflow-y: auto;
    /*overflow-x: hidden;*/
    background: white;
  }
</style>
<script>
  export default {
    props: ["content"]
  }
</script>
