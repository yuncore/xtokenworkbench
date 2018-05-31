<template>
    <div>
        Topic
        {{id}}{{name}}
    </div>
</template>

<script>
    export default {
        name: "Topic",
        data(){
            return {
                id: this.$route.query.id,
                name: this.$route.query.name
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>
