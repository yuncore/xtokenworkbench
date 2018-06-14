<template>
    <div>
        <div id="manage" class="container">
            <div class="left sidebar-left">
                <ul class="sidebar-nav pinned">
                    <li v-for="(item, index) in ROUTEITEMS"
                        :key="index"
                        :class="{active: routerName === item.pathName}">
                        <router-link :to="{name: item.pathName}">
                            {{item.text}}
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
    pathName: "tag-manage",
    text: "Tags"
  },
  {
    pathName: "group-manage",
    text: "Groups"
  }
];

export default {
  name: "Manage",
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

#manage {
    .sidebar-left {
        width: 160px;
        text-align: right;
    }

    .sidebar-nav {
        position: fixed;
        width: 160px;
        box-sizing: border-box;
        background-color: #FFF;
        border: 1px solid #f1f1f1;
        border-radius: 5px;
        font-size: 0;

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
        margin-left: 180px;
        color: #333333;
    }
}
</style>
