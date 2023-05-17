<template>
    <div>
        <task-list/>
    </div>
</template>

<script>
import TaskList from "@/components/Task/TaskList.vue";
import {defineComponent} from "vue";

export default defineComponent({
    components: {TaskList}
})

</script>
