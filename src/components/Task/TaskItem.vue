<!--<template>-->
<!--    <div class="task-item" @click="toggleSubtasks">-->
<!--        <div class="task-item__actions">-->
<!--            <button class="btn btn-secondary" @click="editTask(task)">Edit</button>-->
<!--            <button class="btn btn-danger" @click="showConfirmationDialog(task)">Delete</button>-->
<!--        </div>-->
<!--        <div class="task-item__info">-->
<!--            <span :style="updateTaskCompletion(task)" class="task-item__name">{{ task.name }}</span>-->
<!--            <span class="task-item__marker" v-if="!task.completed">-->
<!--        Mark as completed-->
<!--        <input type="checkbox" v-model="task.completed" @change="updateTaskCompletion(task)">-->
<!--      </span>-->
<!--            <span class="task-item__marker" v-else>-->
<!--        Mark as incomplete-->
<!--        <input type="checkbox" v-model="task.completed" @change="updateTaskCompletion(task)">-->
<!--      </span>-->
<!--        </div>-->
<!--        <div class="task-item__subtasks-info">-->
<!--      <span v-if="task.subtasks.length > 0" class="task-item__subtask-info">-->
<!--        Total subtasks: {{ task.subtasks.length }} | Completed subtasks: {{ getCompletedSubtasksCount(task) }}-->
<!--      </span>-->
<!--        </div>-->
<!--        <div v-if="showSubtasks">-->
<!--            <div v-if="task.subtasks.length === 0" class="task-item__no-subtasks">-->
<!--                No subtasks available for this task-->
<!--            </div>-->
<!--            <ul v-else class="task-item__subtask-list">-->
<!--                <li v-for="subtask in task.subtasks" :key="subtask.id">-->
<!--          <span class="task-item__subtask-label" :style="updateSubtaskCompletion(subtask)">{{ subtask.name }}-->
<!--            <input type="checkbox" v-model="subtask.completed" @change="updateSubtaskCompletion(subtask)">-->
<!--          </span>-->
<!--                </li>-->
<!--            </ul>-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--    props: ['task'],-->
<!--    data() {-->
<!--        return {-->
<!--            showSubtasks: false,-->
<!--        };-->
<!--    },-->
<!--    methods: {-->
<!--        toggleSubtasks(event) {-->
<!--            const targetElement = event.target;-->
<!--            const isCompletionCheckbox = targetElement.tagName === 'INPUT' && targetElement.type === 'checkbox';-->
<!--            const isButton = targetElement.tagName === 'BUTTON';-->

<!--            if (!isCompletionCheckbox && !isButton) {-->
<!--                this.showSubtasks = !this.showSubtasks;-->
<!--            }-->
<!--        },-->
<!--        updateTaskCompletion(task) {-->
<!--            if (task.completed) {-->
<!--                return { textDecoration: 'line-through' };-->
<!--            } else {-->
<!--                return { textDecoration: 'none' };-->
<!--            }-->
<!--        },-->
<!--        updateSubtaskCompletion(subtask) {-->
<!--            if (subtask.completed) {-->
<!--                return { textDecoration: 'line-through' };-->
<!--            } else {-->
<!--                return { textDecoration: 'none' };-->
<!--            }-->
<!--        },-->
<!--        editTask(task) {-->
<!--            // Implement your edit task functionality here-->
<!--        },-->
<!--        showConfirmationDialog(task) {-->
<!--            // Implement your show confirmation dialog functionality here-->
<!--        },-->
<!--        createTask() {-->
<!--            // Implement your create task functionality here-->
<!--        },-->
<!--        getCompletedSubtasksCount(task) {-->
<!--            return task.subtasks.filter((subtask) => subtask.completed).length;-->
<!--        },-->
<!--    },-->
<!--};-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--@import '../../scss/mixins';-->

<!--.task-item {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  padding: 1rem;-->
<!--  border-bottom: 1px solid #eaeaea;-->

<!--  &:last-child {-->
<!--    border-bottom: none;-->
<!--  }-->

<!--  .task-item__info {-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    align-items: center;-->
<!--    margin-top: 14px;-->
<!--  }-->

<!--  .task-item__marker {-->
<!--    @include label-flex;-->
<!--  }-->

<!--  .task-item__actions {-->
<!--    display: flex;-->
<!--    flex-direction: row-reverse;-->
<!--    gap: 0.5rem;-->
<!--    margin-top: 0.5rem;-->
<!--  }-->

<!--  .task-item__subtasks-info {-->
<!--    font-size: 14px;-->
<!--    color: #888;-->
<!--    margin-top: 0.5rem;-->
<!--  }-->

<!--  hr {-->
<!--    margin: 1rem 0;-->
<!--    border: none;-->
<!--    border-top: 1px solid #eaeaea;-->
<!--  }-->

<!--  .task-item__no-subtasks {-->
<!--    font-size: 14px;-->
<!--    color: #888;-->
<!--    margin-top: 1rem;-->
<!--  }-->

<!--  .task-item__subtask-list {-->
<!--    list-style-type: none;-->
<!--    padding: 0;-->
<!--    margin-top: 1rem;-->

<!--    .task-item__subtask-label {-->
<!--      @include label-flex;-->
<!--    }-->

<!--    li {-->
<!--      display: flex;-->
<!--      align-items: center;-->
<!--      margin-bottom: 0.5rem;-->

<!--      input[type="checkbox"] {-->
<!--        margin-right: 0.5rem;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.card__new-task {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  margin-top: 1rem;-->

<!--  input[type="text"] {-->
<!--    margin-right: 0.5rem;-->
<!--  }-->
<!--}-->
<!--</style>-->