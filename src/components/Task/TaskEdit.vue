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
        <h2 class="task-modal__title">Oops! Seems that the task is not found</h2>
        <div class="task-modal__content">
          <span class="task-modal__btn">
            <button class="btn btn-secondary" @click="goHome">Back home</button>
          </span>
        </div>
      </app-modal>
    </template>
    <card v-else :card-title="'Task editor'">
      <template>
        <app-alert v-if="savedSuccessfully" :message="alertResponse"/>
        <div class="task-editor__content">
          <h3 class="task-editor__title">Task</h3>
          <input v-model="editedTask.name" class="task-editor__input" placeholder="Change the task name..."
                 type="text"/>
          <button class="task-editor__delete-btn" @click="showConfirmationDialog(task, 'delete')">X</button>
          <input v-model="editedTask.completed" type="checkbox"/>
        </div>
        <h4 v-if="editedTask.subtasks.length > 0" class="task-editor__subtitle">Subtasks</h4>
        <span v-else class="task-editor__empty-message">
          There are no subtasks yet, but you can add up to or equal to 5.
        </span>
        <div v-for="(subtask, index) in editedTask.subtasks" :key="subtask.id" class="task-editor__content">
          <input v-model="subtask.name" class="task-editor__input" placeholder="Change the subtask name..."
                 type="text"/>
          <button class="task-editor__delete-btn" @click="deleteSubtask(index)">X</button>
          <input v-model="subtask.completed" :class="{ 'task-editor__checkbox--completed': subtask.completed }"
                 type="checkbox"/>
        </div>
        <div class="editor-actions">
          <span>
            <button class="btn btn-primary" @click="saveTask">Save</button>
          </span>
          <span>
            <button class="btn btn-warning" @click="showConfirmationDialog(task, 'edit')">Cancel</button>
          </span>
          <span>
            <button :disabled="isDisabled" class="btn btn-secondary" @click="addNewSubtaskField">New subtask</button>
          </span>
          <span>
            <button class="btn btn-danger" @click="showConfirmationDialog(task, 'delete')">Delete</button>
          </span>
          <span>
            <button :disabled="undoStack.length === 0" class="btn btn-secondary" @click="undo">Undo</button>
          </span>
          <span>
            <button :disabled="redoStack.length === 0" class="btn btn-secondary" @click="redo">Redo</button>
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
import AppAlert from "@/components/ui/Alert/AppAlert.vue";
import {undoRedoMixin} from "@/mixin/undoRedoMixin";
import {goHomeMixin} from "@/mixin/goHomeMixin";

export default defineComponent({
  name: 'TaskEdit',
  mixins: [undoRedoMixin, goHomeMixin],
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
      if (this.actionType === 'edit') {
        this.confirmEdit();
      } else if (this.actionType === 'delete') {
        this.confirmDeletion();
      }
    },
    confirmEdit() {
      this.goHome();
    },

    confirmDeletion() {
      this.$store.dispatch('deleteTask', this.taskToDelete.id);
      this.showModalDelete = false;
      this.goHome();
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
      this.editedTask.subtasks = this.editedTask.subtasks.filter(subtask => subtask.name.trim() !== '');

      const taskCopy = {...this.editedTask}; // Create a copy of the edited task
      this.undoStack.push(taskCopy); // Push the task copy to the undo stack

      this.$store.dispatch('updateTaskAndSubtasks', this.editedTask);

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

<style lang="scss" scoped>
@import '@/scss/mixins';
@import '@/scss/variables';

.task-modal {
  margin: 1rem;
}

.task-editor__title, .task-editor__subtitle {
  margin: 1rem;

  @media #{$common-screen-size} {
    font-size: 14px;
  }
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

  @media #{$common-screen-size} {
    font-size: 13px
  }
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

  @media (max-width: 640px) {
    display: flex;
    flex-wrap: wrap;
  }
}

.btn {
  margin-top: 1rem;
}

</style>