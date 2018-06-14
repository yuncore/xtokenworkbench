<template>
    <div id="app" >
        <router-view style="height: 100%" />
    </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      showBackToTop: false
    };
  },
  methods: {},
  components: {},
  mounted() {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../static/css/base.styl';

#app {
  height: 100%;
}
</style>
