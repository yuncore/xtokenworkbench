<template>
    <div id="head-nav">
        <h1 class="logo">
            <router-link to="/index">
                <img src="../../static/img/logo.svg">
            </router-link>
        </h1>
        <div class="container">
            <ul class="items">
                <li class="menu-item link">
                    <router-link :to="{name: 'currencyList', query: {page: this.currentPage}}">
                        Currency
                    </router-link>
                </li>
                <li class="menu-item link">
                    <router-link :to="{name: 'EventList', query: {page: this.currentPage}}">
                        Event
                    </router-link>
                </li>
                <li class="menu-item link">
                    <router-link :to="{name: 'kol', query: {page: this.currentPage}}">
                        KOL
                    </router-link>
                </li>
                <li class="menu-item link">
                    <router-link :to="{name: 'history_rank', query: {page: this.currentPage}}">
                        History
                    </router-link>
                </li>
                <li class="menu-item drop-down link">
                    <a>
                        More
                        <i class="el-icon-caret-bottom"></i>
                    </a>
                    <ul class="drop-down-menu">
                        <li>Nothing</li>
                    </ul>
                </li>

            </ul>
        </div>
        <div class="profile">
            <img src="../../static/img/ava-default.svg">
            yourName
        </div>
    </div>
</template>

<script>
    export default {
        name: "Head"
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../static/css/base.styl'

    #head-nav
        background-color #232a3a
        height 70px
        text-align center

        .logo
            display inline-block
            margin 0
            padding-left 20px
            position absolute
            left 0
            a
                display inline-block
                line-height 70px
            img
                height 25px

        .items
            margin 0
            padding 0
            height 70px
            font-size 0
            display inline-block
            color #999999

            .menu-item
                display inline-block
                position relative
                height 70px
                line-height 70px
                font-size 14px
                padding 0 25px
                z-index 1

                a
                    display inline-block
                    line-height 70px
                    color #999999
                    height 70px

            .drop-down
                position relative
                cursor pointer

                &:hover
                    .drop-down-menu
                        display block

                .drop-down-menu
                    position absolute
                    background-color #232a3a
                    color #999999
                    list-style none
                    padding 0
                    left 0
                    width 100%
                    border-bottom-left-radius 5px
                    border-bottom-right-radius 5px
                    display none
                    animation .5s fadeInDown
                    z-index -1

                    li
                        margin 0
                        padding 10px 0
                        height 35px
                        line-height 35px

                        &:hover
                            color #008aff

            .link::after
                position absolute
                display block
                content ""
                top 0
                left 0
                bottom 100%
                right 0
                transition .2s
                z-index -1


            .link:hover, .link .active

                &::after
                    bottom 0
                    background-color #008aff

                a
                    color #FFFFFF

        .profile
            display inline-block
            position absolute
            right 0
            top 0
            font-size 14px
            height 70px
            line-height 70px
            padding-right 20px
            color #FFF
            cursor pointer

            img
                height 30px
                width 30px
                border-radius 50%
                vertical-align middle
</style>
