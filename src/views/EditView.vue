<template>
  <div>
      <task-edit :task="task" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Card from '@/components/ui/Card/Card.vue';
import TaskEdit from '@/components/Task/TaskEdit.vue';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'EditView',
  components: {
    Card,
    TaskEdit
  },
  computed: {
    ...mapState(['tasks']),
    task() {
      const taskId = this.$route.params.id;
      return this.tasks.find(task => task.id === taskId);
    }
  }
});
</script>
