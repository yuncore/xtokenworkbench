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
                    </a>
                    <ul class="drop-down-menu">
                        <li>
                            <router-link :to="{name: 'trade_history', query: {page: this.currentPage}}">
                                Trade Record
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="profile">
            <img src="../../static/img/ava-default.svg">
            yourName
            <ul class="profile-drop-down-menu">
                <li>
                    <router-link :to="{name: 'profile', query: {page: this.currentPage}}">
                        Profile
                    </router-link>
                </li>
                <li>Message</li>
                <li>Black List</li>
            </ul>
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
                min-width 50px

                a
                    display inline-block
                    line-height 70px
                    color #999999
                    height 70px

                    &:hover
                        color #FFFFFF

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
                    transition background-color .5s
                    animation .5s fadeInDown
                    z-index -1
                    padding-bottom 5px
                    li
                        height 35px
                        line-height 35px
                        a
                            color #999999
                            height 35px
                            line-height 35px

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
            z-index 1

            &:hover
                .profile-drop-down-menu
                    display block
                    background-color #232a3a

            img
                height 30px
                width 30px
                border-radius 50%
                vertical-align middle

            .profile-drop-down-menu
                position absolute
                background-color #999999
                color #999999
                list-style none
                padding 0
                left 0
                width 100%
                border-bottom-left-radius 5px
                border-bottom-right-radius 5px
                display none
                transition background-color .5s
                animation .5s fadeInDown
                z-index -1
                padding-bottom 5px
                li
                    line-height 35px
                    height 35px
                    a
                        color #999999
                        height 35px
                        line-height 35px

</style>
