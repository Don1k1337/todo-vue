<template>
    <card :card-title="'List of tasks'">
        <task-creator :tasks="tasks" v-on:task-created="onTaskCreated" />
        <div v-for="task in tasks" :key="task.id" class="task-item">
            <div class="task-item__actions">
                <button class="btn btn-secondary" @click="editTask(task)">Edit</button>
                <button class="btn btn-danger" @click="showConfirmationDialog(task)">Delete</button>
            </div>
            <div class="task-item__info" @click="toggleSubtasks(task)">
                <span :style="updateTaskCompletion(task)" class="task-item__name"  @click="toggleSubtasks(task)">{{ task.name }}</span>
                <span class="task-item__marker" v-if="task.completed === false">
          Mark as completed
          <input type="checkbox" v-model="task.completed" @change="updateTaskCompletion(task)">
        </span>
                <span class="task-item__marker" v-if="task.completed === true">
          Mark as incomplete
          <input type="checkbox" v-model="task.completed" @change="updateTaskCompletion(task)">
        </span>
            </div>
            <div class="task-item__subtasks-info">
        <span v-show="task.subtasks.length > 0" class="task-item__subtask-info">
          Total subtasks: {{ task.subtasks.length }} | Completed subtasks: {{ completedSubtasks(task) }}
        </span>
                <div v-show="task.subtasks.length === 0" class="task-item__no-subtasks">
                    No subtasks available for this task
                </div>
            </div>
            <div v-if="task.showSubtasks && task.subtasks.length > 0">
                <ul class="task-item__subtask-list">
                    <li v-for="subtask in task.subtasks" :key="subtask.id">
            <span class="task-item__subtask-label" :style="updateSubtaskCompletion(subtask)">{{ subtask.name }}
              <input type="checkbox" v-model="subtask.completed">
            </span>
                    </li>
                </ul>
            </div>
        </div>
    </card>
</template>




<script>

import Card from "@/components/Card/Card.vue";
import TaskCreator from "@/components/Task/TaskCreator.vue";

export default {
    name: 'AppHome',
    components: {TaskCreator, Card},
    data() {
        return {
            tasks: [],
            creatingNewTask: false,
            newTaskName: '',
            newSubtaskName: {},
        };
    },
    mounted() {
        this.retrieveTasksFromLS();
    },
    methods: {
        toggleSubtasks(task) {
            task.showSubtasks = !task.showSubtasks;
        },

        updateTaskCompletion(task) {
            if (task.completed) {
                return {textDecoration: 'line-through'};
            } else {
                return {textDecoration: 'none'};
            }
        },
        updateSubtaskCompletion(subtask) {
            if (subtask.completed) {
                return {textDecoration: 'line-through'};
            } else {
                return {textDecoration: 'none'};
            }
        },

        editTask(task) {
        },
        showConfirmationDialog(task) {
        },
        onTaskCreated(newTask) {
            newTask.id = this.tasks.length + 1;
            this.tasks.push(newTask);
            this.saveTasksToLS();
        },
        saveTasksToLS() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        },
        retrieveTasksFromLS() {
            const storedTasks = localStorage.getItem('tasks');

            if (storedTasks) {
                this.tasks = JSON.parse(storedTasks);
            }
        }

    },
    computed: {
        totalSubtasks() {
            return task => task.subtasks.length;
        },
        completedSubtasks() {
            return task => {
                const completedSubtasks = task.subtasks.filter(subtask => subtask.completed);
                return completedSubtasks.length;
            };
        },
    },
}
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
