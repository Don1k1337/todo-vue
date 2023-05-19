<template>
  <div class="card__inputs">
    <div class="card__input-group">
      <label class="card__label" for="task-input"></label>
      <input id="task-input" v-model="createTask" class="card__input" placeholder="Type some task..." required
             type="text">
    </div>
    <div class="card__input-group">
      <label class="card__label" for="subtask-input"></label>
      <input id="subtask-input" v-model="createSubtask" class="card__input" placeholder="Type some subtask..."
             type="text">
    </div>
    <button :disabled="isDisabled" class="btn btn-primary" @click="addTask">Create</button>
  </div>
</template>

<script>
export default {
  name: 'TaskCreator',
  data() {
    return {
      createTask: "",
      createSubtask: "",
    };
  },
  methods: {
      addTask() {
        // Additional checks to prevent user actions when button is disabled
        if (this.isDisabled || this.createTask.trim() === '') {
          return;
        }

        const newTask = {
          name: this.createTask,
          completed: false,
          subtasks: []
        };

        if (this.createSubtask.trim() !== '') {
          newTask.subtasks.push({ name: this.createSubtask });
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

<style lang="scss" scoped>
@import "@/scss/mixins";
@import "@/scss/variables";

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

@media #{$common-screen-size} {
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
  @media #{$common-screen-size} {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
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
