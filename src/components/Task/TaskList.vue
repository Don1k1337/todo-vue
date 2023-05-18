<template>
  <card :card-title="'List of tasks'">
    <task-edit v-if="taskForEdit" :task="taskForEdit"/>
    <task-creator :tasks="tasks" v-on:task-created="onTaskCreated"/>
    <app-modal :show-modal="showModal">
      <h3>Please confirm the action</h3>
      <div class="task-modal">
        <span class="task-modal__btn">
          <button class="btn btn-danger" @click="cancelDeletion">Cancel</button>
        </span>
        <span class="task-modal__btn">
          <button class="btn btn-primary" @click="confirmDeletion">Confirm</button>
        </span>
      </div>
    </app-modal>
    <div class="task-item" v-for="task in tasks" :key="task.id">
      <div class="task-item__actions">
        <button class="btn btn-secondary" @click="editTask(task)">Edit</button>
        <button class="btn btn-danger" @click="showConfirmationDialog(task)">Delete</button>
      </div>
      <div class="task-item__info" @click="toggleSubtasks(task)">
        <span class="task-item__name"
              :style="completedTaskStyle(task)"
              @click="toggleSubtasks(task)">
          {{task.name }}
        </span>
        <span class="task-item__marker" v-if="task.completed">
          Mark as incomplete
          <input type="checkbox" v-model="task.completed" @change="updateTaskCompletion(task)">
        </span>
        <span class="task-item__marker" v-else>
          Mark as completed
          <input type="checkbox" v-model="task.completed" @change="updateTaskCompletion(task)">
        </span>
      </div>
      <div class="task-item__subtasks-info">
        <span v-show="task.subtasks.length > 0" class="task-item__subtask-info">
          Total subtasks: {{ totalSubtasks(task.id) }} | Completed subtasks: {{ completedSubtasksCount(task.id) }}
        </span>
        <div v-show="task.subtasks.length === 0" class="task-item__no-subtasks">
          No subtasks available for this task
        </div>
      </div>
      <div v-if="task.showSubtasks && task.subtasks.length > 0">
        <ul class="task-item__subtask-list">
          <li v-for="subtask in task.subtasks" :key="subtask.id">
            <span class="task-item__subtask-label" :style="completedTaskStyle(subtask)">
              {{ subtask.name }}
              <input type="checkbox" v-model="subtask.completed" @change="updateSubtaskCompletion(task.id, subtask)">
            </span>
          </li>
        </ul>
      </div>
    </div>
  </card>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import Card from "@/components/Card/Card.vue";
import TaskCreator from "@/components/Task/TaskCreator.vue";
import AppModal from "@/components/Modal/AppModal.vue";
import TaskEdit from "@/components/Task/TaskEdit.vue";

export default {
  name: 'TaskList',
  data() {
    return {
      showModal: false,
      taskToDelete: '',
      taskForEdit: null
    }
  },
  components: {TaskEdit, AppModal, Card, TaskCreator},
  computed: {
    ...mapState(['tasks']),
    ...mapGetters(['totalSubtasks', 'completedSubtasksCount']),
    completedSubtasksCount() {
      return this.$store.getters.completedSubtasksCount;
    },
  },
  methods: {
    ...mapActions(['retrieveTasksFromLS', 'saveTasksToLS', 'createTask', 'updateTaskCompletion']),
    toggleSubtasks(task) {
      task.showSubtasks = !task.showSubtasks;
    },
    completedTaskStyle(task) {
      return task.completed ? {textDecoration: 'line-through'} : {};
    },
    updateTaskCompletion(task) {
      this.$store.commit('UPDATE_TASK_COMPLETION', {taskId: task.id, completed: task.completed});
    },
    updateSubtaskCompletion(subtask) {
      this.$store.commit('UPDATE_SUBTASK_COMPLETION', {subtaskId: subtask.id, completed: subtask.completed});
    },
    editTask(task) {
      this.$router.push({ name: 'edit-task', params: { id: task.id } });
    },
    confirmDeletion() {
      this.$store.dispatch('deleteTask', this.taskToDelete.id);
      this.showModal = false
    },
    cancelDeletion() {
        this.showModal = false
    },
    showConfirmationDialog(task) {
      this.showModal = true
      this.taskToDelete = task
    },
    onTaskCreated(newTask) {
      this.createTask(newTask);
    },
  },
  mounted() {
    this.retrieveTasksFromLS();
  },
};
</script>

<style scoped lang="scss">
@import "../../scss/mixins";

.card {
  @include common-card;
}

.task-modal {
  display: flex;
  justify-content: space-evenly;
  margin-top: 2rem;
}

.task-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid #eaeaea;

  &:last-child {
    border-bottom: none;
  }

  .task-item__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
  }

  .task-item__marker {
    @include label-flex;
  }

  .task-item__actions {
    display: flex;
    flex-direction: row-reverse;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .task-item__subtasks-info {
    font-size: 14px;
    color: #888;
    margin-top: 0.5rem;
  }

  hr {
    margin: 1rem 0;
    border: none;
    border-top: 1px solid #eaeaea;
  }

  .task-item__no-subtasks {
    font-size: 14px;
    color: #888;
    margin-top: 1rem;
  }

  .task-item__subtask-list {
    list-style-type: none;
    padding: 0;
    margin-top: 1rem;

    .task-item__subtask-label {
      @include label-flex;
    }

    li {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;

      input[type="checkbox"] {
        margin-right: 0.5rem;
      }
    }
  }

  .task-item__name {
    cursor: pointer;
  }
}

.card__new-task {
  display: flex;
  align-items: center;
  margin-top: 1rem;

  input[type="text"] {
    margin-right: 0.5rem;
  }
}
</style>