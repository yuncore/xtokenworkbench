<template>
    <div>
        collector
        {{id}}{{name}}
    </div>
</template>

<script>
    export default {
        name: "Collector",
        data(){
            return {
                id: this.$route.query.id,
                name: this.$route.query.name
            }
        }
    }
</script>

<style scoped>

</style>
