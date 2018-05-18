<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data(){
            return {
                showBackToTop: false
            }
        },
        methods: {

        },
        components: {

        },
        mounted() {

        },

    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import url('../static/css/base.styl');

</style>
