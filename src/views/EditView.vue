<template>
  <div class="task-content">
    <task-edit class="task-edit" :task="resolvedTask" v-if="resolvedTask && !loading" :key="taskId"/>
    <p v-else-if="loading">Loading task...</p>
    <not-found-view v-else/>
  </div>
</template>

<script>
import Card from '@/components/ui/Card/Card.vue';
import TaskEdit from '@/components/Task/TaskEdit.vue';
import { mapGetters, mapState } from 'vuex';
import NotFoundView from "@/views/NotFoundView.vue";

export default {
  name: 'EditView',
  components: {
    NotFoundView,
    Card,
    TaskEdit,
  },
  computed: {
    ...mapGetters(['retrieveTaskById']),
    ...mapState(['loading']),
    taskId() {
      const route = this.$route.params.id;
      return parseInt(route);
    },
    resolvedTask() {
      const task = this.retrieveTaskById(this.taskId);
      if (task) {
        return task;
      } else {
        return null; // Task not found
      }
    },
  },
  async created() {
    try {
      await this.loadData();
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async loadData() {
      await this.$store.commit('SET_LOADING', true);
      try {
        await this.$store.dispatch('retrieveTasksFromLS');
      } catch (e) {
        console.error(e);
      } finally {
        this.$store.commit('SET_LOADING', false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.task-content p {
  color: #ccc;
  margin-top: 10rem;
}
</style>
