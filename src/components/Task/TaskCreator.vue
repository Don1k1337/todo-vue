<template>
  <div class="card__inputs">
    <div class="card__input-group">
      <label class="card__label" for="task-input"></label>
      <input class="card__input" v-model="createTask" type="text" id="task-input" placeholder="Type some task...">
    </div>
    <div class="card__input-group">
      <label class="card__label" for="subtask-input"></label>
      <input class="card__input" v-model="createSubtask" type="text" id="subtask-input" placeholder="Type some subtask...">
    </div>
    <button class="btn btn-primary" :disabled="isDisabled" @click="addTask">Create</button>
  </div>
</template>

<script>
export default {
  name: "TaskCreator",
  data() {
    return {
      createTask: "",
      createSubtask: "",
    };
  },
  methods: {
    addTask() {
      // additional checks to prevent user actions when button is :disabled
      if (this.isDisabled) {
        return;
      }
      const newTask = {
        id: this.$store.state.tasks.length + 1,
        name: this.createTask,
        completed: false,
        subtasks: []
      };

      if (this.createSubtask.trim() !== '') {
        const newSubtask = {
          id: 1,
          name: this.createSubtask,
          completed: false
        };
        newTask.subtasks.push(newSubtask);
      }

      this.$store.dispatch('createTask', newTask);
      this.createTask = '';
      this.createSubtask = '';
    },
  },
  computed: {
    isDisabled() {
      return this.createTask.trim() === "";
    },
  },
};
</script>

<style scoped lang="scss">
@import 'src/scss/mixins';

.card {
  @include common-card;
}
.card__inputs {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.card__input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

@media (max-width: 767px) {
  .card__inputs {
    flex-direction: column;
    padding: 0 10px;
  }
}

.card__title {
  font-size: 18px;
}

.card__input {
  @include common-input;
  @media (max-width: 767px) {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0;
    margin-bottom: 10px;
  }
}

.btn {
  @include common-btn;
  padding: 7px;
  margin-bottom: 10px;
}

</style>
