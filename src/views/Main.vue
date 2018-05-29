<template>
    <div>
        <Head></Head>
        <router-view class="wrap"/>
        <transition name="back-top-fade">
            <div
                class="page-component-up"
                :class="{ 'hover': hover }"
                v-show="showBackToTop"
                @mouseenter="hover = true"
                @mouseleave="hover = false"
                @click="toTop">
                <i class="el-icon-caret-top"></i>
            </div>
        </transition>
        <Foot>
        </Foot>
    </div>
</template>

<script>
    import throttle from 'throttle-debounce/throttle';
    import Head from '../views/Head'
    import Foot from '../views/Foot'

    export default {
        name: 'app',
        data(){
            return {
                showBackToTop: false
            }
        },
        methods: {
            toTop() {
                this.hover = false;
                this.showBackToTop = false;
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            },
            handleScroll() {
                this.showBackToTop = (document.body.scrollTop || document.documentElement.scrollTop) >= 500;
            }
        },
        components: {
            Head,
            Foot
        },
        mounted() {
            this.throttledScrollHandler = throttle(300, this.handleScroll);
            document.addEventListener('scroll', this.throttledScrollHandler);
        },
        beforeDestroy() {
            document.removeEventListener('scroll', this.throttledScrollHandler);
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import url('../../static/css/base.styl');

    .back-top-fade-enter,
    .back-top-fade-leave-active {
        transform: translateY(-30px);
        opacity: 0;
    }
    .page-component-up {
        background-color: #FFF;
        position: fixed;
        right: 100px;
        bottom: 150px;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        cursor: pointer;
        transition: .3s;
        box-shadow: 0 0 6px rgba(0,0,0,.12);
        z-index: 5;
    }

    .page-component-up i {
        color: #409eff;
        display: block;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
    }

    .page-component-up:hover {
        opacity: 1;
    }

    .wrap{
        min-height: calc(100% - 70px);
        padding: 20px 0;
        box-sizing: border-box;
        padding-top: 90px
    }
</style>
