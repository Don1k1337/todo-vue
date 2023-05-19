<template>
  <div>
    <app-modal :show-modal="showModalDelete || showModalEdit">
      <h3 class="task-modal__title">Please confirm the action</h3>
      <div class="task-modal__content">
        <span class="task-modal__btn">
          <button class="btn btn-danger" @click="cancelAction">Cancel</button>
        </span>
        <span class="task-modal__btn">
          <button class="btn btn-primary" @click="confirmAction">Confirm</button>
        </span>
      </div>
    </app-modal>
    <template v-if="!task || !taskLoaded">
      <app-modal :show-modal="taskNotFound = true">
        <h2 class="task-modal__title">Oops! Seems that the URL path is not correct, or the task is not found</h2>
        <div class="task-modal__content">
          <span class="task-modal__btn">
            <button class="btn btn-secondary" @click="goHome">Back home</button>
          </span>
        </div>
      </app-modal>
    </template>
    <card :card-title="'Task editor'" v-else>
      <template>
        <app-alert :message="alertResponse" v-if="savedSuccessfully"/>
        <div class="task-editor__content">
          <h3 class="task-editor__title">Task</h3>
          <input class="task-editor__input" v-model="editedTask.name" type="text"
                 placeholder="Change the task name..."/>
          <button class="task-editor__delete-btn" @click="showConfirmationDialog(task, 'delete')">X</button>
          <input type="checkbox" v-model="editedTask.completed"/>
        </div>
        <h4 v-if="editedTask.subtasks.length > 0" class="task-editor__subtitle">Subtasks</h4>
        <span v-else class="task-editor__empty-message">
          There are no subtasks yet, but you can add up to or equal to 5.
        </span>
        <div class="task-editor__content" v-for="(subtask, index) in editedTask.subtasks" :key="subtask.id">
          <input class="task-editor__input" v-model="subtask.name" type="text"
                 placeholder="Change the subtask name..."/>
          <button class="task-editor__delete-btn" @click="deleteSubtask(index)">X</button>
          <input type="checkbox" v-model="subtask.completed"
                 :class="{ 'task-editor__checkbox--completed': subtask.completed }"/>
        </div>
        <div class="editor-actions">
          <span>
            <button class="btn btn-primary" @click="saveTask">Save</button>
          </span>
          <span>
            <button class="btn btn-warning" @click="showConfirmationDialog(task, 'edit')">Cancel</button>
          </span>
          <span>
            <button class="btn btn-secondary" @click="addNewSubtaskField" :disabled="isDisabled">New subtask</button>
          </span>
          <span>
            <button class="btn btn-danger" @click="showConfirmationDialog(task, 'delete')">Delete</button>
          </span>
          <span>
            <button class="btn btn-secondary" @click="undo" :disabled="undoStack.length === 0">Undo</button>
          </span>
          <span>
            <button class="btn btn-secondary" @click="redo" :disabled="redoStack.length === 0">Redo</button>
          </span>
        </div>
      </template>
    </card>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import Card from "@/components/ui/Card/Card.vue";
import AppModal from "@/components/ui/Modal/AppModal.vue";
import router from "@/router";
import AppAlert from "@/components/ui/Alert/AppAlert.vue";
import {undoRedoMixin} from "@/mixin/undoRedoMixin";

export default defineComponent({
  name: 'TaskEdit',
  mixins: [undoRedoMixin],
  props: {
    task: {
      type: Object,
      required: true,
    }
  },
  components: {AppAlert, AppModal, Card},
  data() {
    return {
      editedTask: {},
      taskNotFound: false,
      taskLoaded: false,
      undoStack: [],
      redoStack: [],
      showModalDelete: false,
      showModalEdit: false,
      actionType: '',
      cancelActionType: '',
      alertMsg: '',
      savedSuccessfully: false
    };
  },
  watch: {
    task: {
      immediate: true,
      handler(newTask) {
        if (newTask) {
          this.editedTask = {...newTask}
          this.taskLoaded = true
        }
      }
    }
  },
  methods: {


    addNewSubtaskField() {
      if (this.isDisabled) {
        return;
      }

      const newSubtask = {id: Date.now(), name: ''};
      this.editedTask.subtasks.push(newSubtask);
      this.addToUndoStack({type: 'add', subtask: newSubtask, index: this.editedTask.subtasks.length - 1});
    },


    cancelAction() {
      this.showModalDelete = false;
      this.showModalEdit = false;
    },
    confirmAction() {
      console.log('Action Type:', this.actionType);
      if (this.actionType === 'edit') {
        this.confirmEdit();
      } else if (this.actionType === 'delete') {
        this.confirmDeletion();
      }
    },
    confirmEdit() {
      this.goHome();
    },
    goHome: () => {
      router.push('/');
    },
    confirmDeletion() {
      this.goHome();
      this.$store.dispatch('deleteTask', this.taskToDelete.id);
      this.showModalDelete = false;
    },
    cancelDeletion() {
      this.showModalDelete = false;
    },
    showConfirmationDialog(task, type) {
      this.actionType = type;
      if (type === 'edit') {
        this.showModalEdit = true;
      } else if (type === 'delete') {
        this.showModalDelete = true;
      }
      this.taskToDelete = task;
    },


    deleteSubtask(index) {
      const deletedSubtask = this.editedTask.subtasks[index];
      this.editedTask.subtasks.splice(index, 1);
      this.addToUndoStack({type: 'delete', subtask: deletedSubtask, index});
    },

    undo() {
      if (this.undoStack.length > 0) {
        const lastAction = this.undoStack.pop();
        this.redoStack.push(lastAction);

        if (lastAction.type === 'delete') {
          if (this.editedTask.subtasks.length >= 5) {
            this.editedTask.subtasks.splice(lastAction.index, 0, lastAction.subtask);
            this.editedTask.subtasks.pop();
          } else {
            this.editedTask.subtasks.splice(lastAction.index, 0, lastAction.subtask);
          }
        } else if (lastAction.type === 'add') {
          this.editedTask.subtasks.splice(lastAction.index, 1);
        }
      }
    },

    redo() {
      if (this.redoStack.length > 0) {
        const nextAction = this.redoStack.pop();
        this.undoStack.push(nextAction);

        if (nextAction.type === 'delete') {
          this.editedTask.subtasks.splice(nextAction.index, 1);
        } else if (nextAction.type === 'add') {
          if (this.editedTask.subtasks.length >= 5) {
            this.editedTask.subtasks.splice(nextAction.index, 0, nextAction.subtask);
            this.editedTask.subtasks.pop();
          } else {
            this.editedTask.subtasks.splice(nextAction.index, 0, nextAction.subtask);
          }
        }
      }
    },

    saveTask() {
      // Filter out empty subtasks
      // Update the editedTask with non-empty subtasks
      this.editedTask.subtasks = this.editedTask.subtasks.filter(subtask => subtask.name.trim() !== '');

      // Check if task completion has changed
      const originalTask = this.$store.state.tasks.find(task => task.id === this.editedTask.id);
      const hasTaskChanges =
          originalTask.completed !== this.editedTask.completed ||
          originalTask.name !== this.editedTask.name ||
          originalTask.description !== this.editedTask.description;

      // Check if subtask completion or details have changed
      const subtaskChanges = this.editedTask.subtasks.map(subtask => {
        const originalSubtask = originalTask.subtasks.find(st => st.id === subtask.id);
        if (originalSubtask) {
          return (
              originalSubtask.completed !== subtask.completed ||
              originalSubtask.name !== subtask.name
          );
        }
        return false;
      });

      // Commit the mutations if there are changes
      if (hasTaskChanges) {
        this.$store.commit('UPDATE_TASK', this.editedTask);
      }
      subtaskChanges.forEach((changed, index) => {
        if (changed) {
          const subtask = this.editedTask.subtasks[index];
          this.$store.commit('UPDATE_SUBTASK', {
            taskId: this.editedTask.id,
            subtaskId: subtask.id,
            completed: subtask.completed,
            name: subtask.name
          });
        }
      });

      this.$store.dispatch('saveTasksToLS');
      this.savedSuccessfully = true;
    }
  },
  computed: {
    isDisabled() {
      return this.editedTask.subtasks.length >= 5
    },
    alertResponse() {
      if (this.savedSuccessfully === false) {
        return 'Not saved';
      } else {
        return 'Saved successfully!';
      }
    },
  }
});
</script>

<style scoped lang="scss">
@import '@/scss/mixins';

.task-modal {
  margin: 1rem;
}

.task-editor__title, .task-editor__subtitle {
  margin: 1rem;
}

.task-editor__content {
  margin-bottom: 0.5rem;

  .task-editor__delete-btn {
    background: #e74c3c;
    color: #ffffff;
    cursor: pointer;
    border: none;

    &:hover {
      background: #c0392b;
      color: #ffffff;
    }
  }
}

.task-editor__empty-message {
  margin-top: 1000rem;
}

.task-editor__input {
  @include common-input;
  width: 200px;

}

.task-modal__content {
  display: flex;
  justify-content: space-evenly;
}

.editor-actions {
  display: flex;
  justify-content: space-evenly;

  @media (max-width: 445px) {
    display: flex;
    flex-wrap: wrap;
  }
}

.btn {
  margin-top: 1rem;
}

</style>