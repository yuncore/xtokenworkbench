<template>
    <div id="head-nav">
        <h1 class="logo">
            <router-link :to="{name: 'main'}">
                <img src="../../static/img/logo.svg">
            </router-link>
        </h1>
        <div class="container">
            <ul class="items">
                <li v-for="(item, index) in MENUITEMS"
                    :key="index"
                    :class="{'drop-down': item.dropDown}"
                    class="menu-item link">
                    <a v-if="item.dropDown"
                       :class="{'active':item.dropDownItems.map(i => i.pathName).indexOf(routerName) > -1}">
                        {{item.text}}
                        <ul class="drop-down-menu">
                            <li v-for="(item2, index2) in item.dropDownItems"
                                :key="index2">
                                <router-link
                                    :class="{'active': routerName === item2.pathName}"
                                    :to="{name: item2.pathName}">
                                    {{item2.text}}
                                </router-link>
                            </li>
                        </ul>
                    </a>
                    <router-link
                        :class="{'active': routerName === item.pathName}"
                        v-else
                        :to="{name: item.pathName}">
                        {{item.text}}
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="profile">
            <img :src="icon">
            {{name}}
            <ul class="profile-drop-down-menu">
                <li>
                    <router-link :to="{name: 'setting', query: {page: this.currentPage}}">
                        Setting
                    </router-link>
                </li>
                <li>Message</li>
                <li>Black List</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    const MENUITEMS = [
        {
            pathName: 'currencyList',
            text: 'Currency'
        },
        {
            pathName: 'EventList',
            text: 'Event'
        },
        {
            pathName: 'kol',
            text: 'KOL'
        },
        {
            pathName: 'history_rank',
            text: 'History'
        },
        {
            pathName: '',
            text: 'More',
            dropDown: true,
            dropDownItems: [
                {
                    pathName: 'trade_history',
                    text: 'Trade Record'
                }
            ]
        },
    ];

    export default {
        name: "Head",
        data(){
            return {
                MENUITEMS,
            }
        },
        computed:{
            ...mapGetters(['name', 'icon']),
            routerName(){
                return this.$route.name
            },
        },    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../static/css/base.styl'

    #head-nav
        background-color #232a3a
        height 70px
        text-align center
        z-index 9999
        width 100%
        position fixed

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
                    &:hover, &.active
                        color #FFFFFF

            .drop-down
                position relative
                cursor pointer
                color red

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
                            &:hover, &.active
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
            cursor pointer
            z-index 1
            min-width 100px
            color #999999

            &:hover
                color #FFF
                .profile-drop-down-menu
                    display block
                    background-color #232a3a

            img
                height 30px
                width 30px
                border-radius 50%
                vertical-align middle
                margin-right 10px

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
                        &:hover
                            color #FFF

    .headroom {
        transition: transform 200ms linear;
    }
    .headroom--pinned {
        transform: translateY(0%);
    }
    .headroom--unpinned {
        transform: translateY(-100%);
    }

</style>
