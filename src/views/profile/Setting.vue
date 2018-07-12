<template>
    <div>
        <div id="profile" class="container">
            <div class="left sidebar-left">
                <ul class="sidebar-nav">
                    <li v-for="(item, index) in ROUTEITEMS"
                        :key="index"
                        :class="{active: routerName === item.pathName}">
                        <router-link :to="{name: item.pathName}">
                            {{item.text}}
                            <!--<i class="el-icon-arrow-right"></i>-->
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
    </div>
</template>

<script>
const ROUTEITEMS = [
  {
    pathName: "setting-index",
    text: "Profile"
  },
  {
    pathName: "setting-password",
    text: "Password"
  },
  // {
  //   pathName: "setting-apiKey",
  //   text: "Exchange API"
  // }
];

export default {
  name: "profile",
  data() {
    return {
      ROUTEITEMS
    };
  },
  computed: {
    routerName() {
      return this.$route.name;
    }
  },
  mounted() {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../static/css/base.styl';

#profile {
    .sidebar-left {
        width: 160px;
        text-align: right;
    }

    .sidebar-nav {
        position: fixed;
        width: 160px;
        background-color: #FFF;
        border: 1px solid #f1f1f1;
        border-radius: 5px;
        font-size: 0;
        box-sizing: border-box;

        .active {
            background-color: rgba(64, 158, 255, 0.06);
            border-right: 3px solid #409eff;
            color: #333333;

            a {
                color: #333333;
            }

            i {
                display: block;
            }
        }

        li {
            text-align: left;
            height: 45px;
            padding: 0 20px;
            line-height: 45px;
            font-size: 13px;
            cursor: pointer;
            border-bottom: 1px solid #f1f1f1;

            a {
                color: #999999;
                width: 100%;
                height: 100%;
                display: block;
            }

            i {
                display: none;
                vertical-align: middle;
                height: 50px;
                line-height: 50px;
                float: right;
            }

            &:last-child {
                border-bottom: none;
            }
        }
    }

    .content {
        margin-left: 200px;
        width: 700px;
        color: #333333;
    }
}
</style>
