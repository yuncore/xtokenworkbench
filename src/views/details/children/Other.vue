<template>
    <div id="otherLink">
        <div class="head">
            <img src="../../../../static/img/detail_left_other.svg">
            <span>Links</span>
        </div>
        <div class="content">

        </div>
    </div>
</template>

<script>
export default {
  name: "Other"
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#otherLink {
    .head {
        line-height: 35px;
        height: 35px;

        img {
            height: 25px;
            width: 25px;
            vertical-align: middle;
        }

        span {
            font-size: 15px;
            line-height: 35px;
            color: #333333;
            font-weight: bold;
        }
    }

    .content {
        margin-top: 20px;
    }
}
</style>
