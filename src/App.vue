<template>
    <div id="app">
        <the-navbar/>
        <router-view/>
    </div>
</template>

<script>
import TheNavbar from "@/components/TheNavbar.vue";
import {defineComponent} from "vue";

export default defineComponent({
    components: {TheNavbar}
})

</script>
