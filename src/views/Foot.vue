<template>
    <div id="footer">
        <img src="../../static/img/logo.svg">
        <span>
            ©2018 All rights reserved
        </span>
    </div>
</template>

<script>
export default {
  name: "Foot"
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#footer {
    display: block;
    background-color: #232a3a;
    width: 100%;
    height: 70px;
    line-height: 70px;
    text-align: center;

    img {
        vertical-align: middle;
        height: 15px;
        margin-right: 5px;
    }

    span {
        vertical-align: middle;
        color: #FFFFFF;
        font-size: 14px;
        line-height: 100%;
    }
}
</style>
