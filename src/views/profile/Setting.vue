<template>
    <div id="profile" class="container">
        <div class="left sidebar-left">
            <ul class="sidebar-nav">
                <li v-for="(item, index) in ROUTEITEMS"
                    :key="index"
                    :class="{active: routerName === item.pathName}">
                    <router-link :to="{name: item.pathName}">
                        {{item.text}}
                        <i class="el-icon-arrow-right"></i>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="content">
            <transition mode="out-in" name="el-zoom-in-top">
                <router-view />
            </transition>
        </div>
    </div>
</template>

<script>
    const ROUTEITEMS = [
        {
            pathName: 'setting-index',
            text: 'Profile',
        },
        {
            pathName: 'setting-password',
            text: 'Password',
        },
        {
            pathName: 'setting-apiKey',
            text: 'Exchange API',
        },
    ];

    export default {
        name: "profile",
        data(){
            return {
                ROUTEITEMS
            }
        },
        computed:{
           routerName(){
               return this.$route.name
           }
        },
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    #profile

        .sidebar-left
            width 300px
            text-align right

        .sidebar-nav
            display inline-block
            width 200px
            background-color #FFF
            border 1px solid #f1f1f1
            border-radius 5px

            .active
                a
                    color #333333

                i
                    display block

            li
                text-align left
                height 60px
                padding 0 20px
                line-height 60px
                cursor pointer
                border-bottom 1px solid #f1f1f1

                a
                    color #999999

                i
                    display none
                    vertical-align middle
                    height 60px
                    line-height 60px
                    float right

                &:last-child
                    border-bottom none

        .content
            margin-left 320px
</style>
