<template>
    <card :card-title="'List of tasks'">
        <task-creator :tasks="tasks" v-on:task-created="onTaskCreated"/>
        <div class="task-item"
             v-for="task in tasks" :key="task.id">
            <div class="task-item__actions">
                <button
                        class="btn btn-secondary"
                        @click="editTask(task)">Edit
                </button>
                <button
                        class="btn btn-danger"
                        @click="showConfirmationDialog(task)">Delete
                </button>
            </div>
            <div class="task-item__info"
                 @click="toggleSubtasks(task)">
                <span class="task-item__name"
                      :style="completedTaskStyle(task)"
                      @click="toggleSubtasks(task)">{{ task.name }}</span>
                <span class="task-item__marker" v-if="task.completed">
                    Mark as incomplete
                    <input type="checkbox"
                           v-model="task.completed"
                           @change="updateTaskCompletion(task)">
                </span>
                <span class="task-item__marker" v-else>
                    Mark as completed
                    <input type="checkbox" v-model="task.completed" @change="updateTaskCompletion(task)">
                </span>
            </div>
            <div class="task-item__subtasks-info">
                <span v-show="task.subtasks.length > 0" class="task-item__subtask-info">
                  Total subtasks: {{ task.subtasks.length }} | Completed subtasks: {{ completedSubtasksCount }}
                </span>
                <div v-show="task.subtasks.length === 0" class="task-item__no-subtasks">
                    No subtasks available for this task
                </div>
            </div>
            <div v-if="task.showSubtasks && task.subtasks.length > 0">
                <ul class="task-item__subtask-list">
                    <li v-for="subtask in task.subtasks" :key="subtask.id">
            <span class="task-item__subtask-label" :style="completedTaskStyle(subtask)">{{ subtask.name }}
              <input type="checkbox" v-model="subtask.completed" @change="updateSubtaskCompletion">
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

export default {
    name: 'TaskList',
    components: {Card, TaskCreator},
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
            this.$store.commit('updateTaskCompletion', {taskId: task.id, completed: task.completed});
        },
        updateSubtaskCompletion(subtask) {
            this.$store.commit('updateSubtaskCompletion', {subtaskId: subtask.id, completed: subtask.completed});
        },
        editTask(task) {

        },
        showConfirmationDialog(task) {

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
    cursor: pointer; // Indicates that it is clickable
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
