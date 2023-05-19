<template>
  <div class="task-content">
    <task-edit class="task-edit" :task="resolvedTask" v-if="resolvedTask && !loading" :key="taskId"/>
    <p v-else>Loading task...</p>
  </div>
</template>

<script>
import Card from '@/components/ui/Card/Card.vue';
import TaskEdit from '@/components/Task/TaskEdit.vue';
import {mapGetters, mapState} from 'vuex';

export default {
  name: 'EditView',
  components: {
    Card,
    TaskEdit,
  },
  computed: {
    ...mapGetters(['retrieveTaskById']),
    ...mapState(['tasks', 'loading']),
    taskId() {
      return this.$route.params.id;
    },
    resolvedTask() {
      return this.retrieveTaskById(this.taskId);
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      await this.$store.commit('SET_LOADING', true);
      try {
        await this.$store.dispatch('retrieveTaskById', this.taskId);
      } catch (e) {
        throw new Error(e)
      } finally {
        await this.$store.commit('SET_LOADING', false);
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
