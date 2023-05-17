<template>
    <div>
        <h1>Страница редактирования задачи {{ taskId }}</h1>
        <!-- ... Форма редактирования задачи ... -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            taskId: null
        };
    },
    created() {
        this.taskId = this.$route.params.id;
    }
};
</script>
